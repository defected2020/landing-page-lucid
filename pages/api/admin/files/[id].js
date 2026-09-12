import { withAdminApi, sendJson } from '../../../../lib/admin/api';
import { getFileRecord, updateFileRecord, deleteFile } from '../../../../lib/admin/store';

export default withAdminApi(
  async (req, res) => {
    const { id } = req.query;
    if (req.method === 'GET') {
      const file = await getFileRecord(id);
      return file ? sendJson(res, 200, { file }) : sendJson(res, 404, { error: 'Not found' });
    }
    if (req.method === 'PATCH') {
      const file = await updateFileRecord(id, req.body || {});
      return file ? sendJson(res, 200, { file }) : sendJson(res, 404, { error: 'Not found' });
    }
    const removed = await deleteFile(id);
    return removed ? sendJson(res, 200, { ok: true }) : sendJson(res, 404, { error: 'Not found' });
  },
  { methods: ['GET', 'PATCH', 'DELETE'] }
);
