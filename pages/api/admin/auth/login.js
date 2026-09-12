import { authenticate, isAuthConfigured, sessionCookieHeader } from '../../../../lib/admin/auth';
import { sendJson } from '../../../../lib/admin/api';

// Cheap brute-force damper. Serverless instances reset this, but it still
// slows a single hot loop and costs nothing.
const failures = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 10;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  if (!isAuthConfigured()) {
    return sendJson(res, 503, {
      error: 'Admin login is not configured. Set ADMIN_USERS or ADMIN_PASSWORD.',
    });
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .toString()
    .split(',')[0]
    .trim();
  const entry = failures.get(ip);
  if (entry && entry.count >= MAX_FAILS && Date.now() - entry.first < WINDOW_MS) {
    return sendJson(res, 429, { error: 'Too many attempts. Try again in a few minutes.' });
  }

  const { name, password } = req.body || {};
  const user = authenticate(name, password);
  if (!user) {
    const now = Date.now();
    const cur = entry && now - entry.first < WINDOW_MS ? entry : { first: now, count: 0 };
    failures.set(ip, { ...cur, count: cur.count + 1 });
    await new Promise((r) => setTimeout(r, 400));
    return sendJson(res, 401, { error: 'Wrong name or password' });
  }

  failures.delete(ip);
  res.setHeader('Set-Cookie', sessionCookieHeader(user));
  return sendJson(res, 200, { user });
}
