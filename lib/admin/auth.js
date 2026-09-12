// Session auth for the internal admin area. Server-only: never import from
// client components.
//
// Users come from env vars, no database needed for a small team:
//   ADMIN_USERS="george:secret-one,anna:secret-two"   (name:password, comma separated)
//   ADMIN_PASSWORD="shared-secret"                     (single shared login, user "admin")
//   ADMIN_SESSION_SECRET="long random string"          (signs the session cookie)
//
// Sessions are a signed, HttpOnly cookie. There is no server-side session
// store, so logging out simply clears the cookie; rotating
// ADMIN_SESSION_SECRET invalidates every session at once.

import crypto from 'crypto';

export const SESSION_COOKIE = 'lcl_admin_session';
const SESSION_DAYS = 30;

function parseUsers() {
  const users = [];
  const raw = process.env.ADMIN_USERS || '';
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((entry) => {
      const idx = entry.indexOf(':');
      if (idx <= 0) return;
      const name = entry.slice(0, idx).trim().toLowerCase();
      const password = entry.slice(idx + 1);
      if (name && password) users.push({ name, password });
    });
  if (process.env.ADMIN_PASSWORD) {
    users.push({ name: 'admin', password: process.env.ADMIN_PASSWORD });
  }
  return users;
}

export function isAuthConfigured() {
  return parseUsers().length > 0;
}

function sessionSecret() {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  // Fallback: derive from the credentials so the app still works without the
  // extra variable. Changing any password then logs everyone out, which is a
  // reasonable default.
  const users = parseUsers();
  if (!users.length) return null;
  return crypto
    .createHash('sha256')
    .update('lcl-admin-fallback:' + users.map((u) => `${u.name}:${u.password}`).join('|'))
    .digest('hex');
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) {
    // Compare against self to keep timing flat, then fail.
    crypto.timingSafeEqual(ba, ba);
    return false;
  }
  return crypto.timingSafeEqual(ba, bb);
}

function sign(payload) {
  return crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
}

/** Returns the user object on success, null on bad credentials. */
export function authenticate(name, password) {
  const users = parseUsers();
  const wanted = String(name || '').trim().toLowerCase();
  let match = null;
  // Check every user so timing does not leak which names exist.
  for (const user of users) {
    const nameOk = safeEqual(user.name, wanted);
    const passOk = safeEqual(user.password, password || '');
    if (nameOk && passOk) match = user;
  }
  return match ? { name: match.name } : null;
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({ u: user.name, exp: Date.now() + SESSION_DAYS * 86400 * 1000 })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !sessionSecret()) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!safeEqual(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.u || !data.exp || Date.now() > data.exp) return null;
    return { name: data.u };
  } catch {
    return null;
  }
}

function parseCookies(header) {
  const out = {};
  (header || '').split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx < 0) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

/** Reads the session from an incoming request (API route or getServerSideProps). */
export function getSessionUser(req) {
  const cookies = parseCookies(req.headers?.cookie);
  return verifySessionToken(cookies[SESSION_COOKIE]);
}

function cookieAttrs(maxAgeSeconds) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}

export function sessionCookieHeader(user) {
  return `${SESSION_COOKIE}=${encodeURIComponent(createSessionToken(user))}; ${cookieAttrs(
    SESSION_DAYS * 86400
  )}`;
}

export function clearSessionCookieHeader() {
  return `${SESSION_COOKIE}=; ${cookieAttrs(0)}`;
}
