import { getSessionUser } from '../../../../lib/admin/auth';
import { sendJson } from '../../../../lib/admin/api';
import { storageMode } from '../../../../lib/admin/objectStore';
import { storeUpload, newId, MAX_UPLOAD_BYTES, safeFileName } from '../../../../lib/admin/store';

// Two upload paths share this route:
//
//   PUT  <raw file bytes>  ?name=&type=&description=
//        Server-side upload. Used in local dev and works on Vercel too, but
//        Vercel caps request bodies at ~4.5 MB, so production uses the next one.
//
//   POST { type: 'blob.generate-client-token', ... }
//        Vercel Blob client-upload handshake (@vercel/blob/client `upload()`).
//        The browser sends the bytes directly to Blob after we mint a token
//        here, then registers metadata via POST /api/admin/files.
//
// Body parsing is off so the raw PUT can be streamed straight into storage.
export const config = { api: { bodyParser: false, responseLimit: false } };

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  const user = getSessionUser(req);
  if (!user) return sendJson(res, 401, { error: 'Not signed in' });

  try {
    if (req.method === 'PUT') {
      const name = safeFileName(req.query.name || 'file');
      const contentType = String(req.query.type || req.headers['content-type'] || 'application/octet-stream');
      const declared = Number(req.headers['content-length'] || 0);
      if (declared > MAX_UPLOAD_BYTES) return sendJson(res, 413, { error: 'File too large' });
      const file = await storeUpload(
        { name, contentType, body: req, description: req.query.description },
        user
      );
      return sendJson(res, 201, { file });
    }

    if (req.method === 'POST') {
      if (storageMode() !== 'blob') {
        return sendJson(res, 400, { error: 'Client uploads need Vercel Blob (BLOB_READ_WRITE_TOKEN)' });
      }
      const { handleUpload } = await import('@vercel/blob/client');
      const body = JSON.parse((await readBody(req)).toString('utf8') || '{}');
      const result = await handleUpload({
        request: req,
        body,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          // Only allow uploads into the admin area, under a fresh id we issued
          // (the client asks for one via GET first).
          const payload = clientPayload ? JSON.parse(clientPayload) : {};
          const expected = `admin/uploads/${payload.id}/`;
          if (!/^[a-f0-9]{16}$/.test(payload.id || '') || !pathname.startsWith(expected)) {
            throw new Error('Upload path not allowed');
          }
          return {
            addRandomSuffix: false,
            allowOverwrite: true,
            maximumSizeInBytes: MAX_UPLOAD_BYTES,
            tokenPayload: JSON.stringify({ user: user.name, id: payload.id }),
          };
        },
        // Metadata is registered by the browser after the upload resolves, so
        // nothing is needed here (this callback also cannot reach localhost).
        onUploadCompleted: async () => {},
      });
      return sendJson(res, 200, result);
    }

    if (req.method === 'GET') {
      // Hands the browser a fresh id + storage path for a client upload.
      const name = safeFileName(req.query.name || 'file');
      const id = newId();
      return sendJson(res, 200, { id, name, pathname: `admin/uploads/${id}/${name}` });
    }

    res.setHeader('Allow', 'GET, PUT, POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin upload]', err);
    return sendJson(res, 500, { error: err.message || 'Upload failed' });
  }
}
