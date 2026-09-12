import { clearSessionCookieHeader } from '../../../../lib/admin/auth';
import { sendJson } from '../../../../lib/admin/api';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }
  res.setHeader('Set-Cookie', clearSessionCookieHeader());
  return sendJson(res, 200, { ok: true });
}
