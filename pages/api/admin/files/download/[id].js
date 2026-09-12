import { withAdminApi, sendJson } from '../../../../../lib/admin/api';
import { openFile } from '../../../../../lib/admin/store';

// Streams a stored file to an authenticated user. Blobs are private, so this
// route is the only way to read them; the browser never sees a storage URL.
export const config = { api: { responseLimit: false } };

export default withAdminApi(
  async (req, res) => {
    const file = await openFile(req.query.id);
    if (!file) return sendJson(res, 404, { error: 'Not found' });

    const inline = req.query.inline === '1';
    const encodedName = encodeURIComponent(file.record.name).replace(/['()]/g, escape);
    res.setHeader('Content-Type', file.contentType || file.record.contentType || 'application/octet-stream');
    if (file.size) res.setHeader('Content-Length', String(file.size));
    res.setHeader(
      'Content-Disposition',
      `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodedName}`
    );
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    await new Promise((resolve, reject) => {
      file.stream.on('error', reject);
      res.on('finish', resolve);
      res.on('close', resolve);
      file.stream.pipe(res);
    });
  },
  { methods: ['GET'] }
);
