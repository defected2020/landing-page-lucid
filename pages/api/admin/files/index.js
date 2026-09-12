import { withAdminApi, sendJson } from '../../../../lib/admin/api';
import { listFiles, registerFile } from '../../../../lib/admin/store';

// GET  → list
// POST → register metadata for a file the browser uploaded straight to Blob
//        (see /api/admin/files/upload for the token handshake).
export default withAdminApi(
  async (req, res, user) => {
    if (req.method === 'GET') {
      return sendJson(res, 200, { files: await listFiles() });
    }
    const { id, name, size, contentType, description } = req.body || {};
    if (!id || !name) return sendJson(res, 400, { error: 'id and name are required' });
    const file = await registerFile({ id, name, size, contentType, description }, user);
    return sendJson(res, 201, { file });
  },
  { methods: ['GET', 'POST'] }
);
