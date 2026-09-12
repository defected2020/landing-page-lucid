import { withAdminApi, sendJson } from '../../../../lib/admin/api';
import { getDoc, saveDoc, deleteDoc } from '../../../../lib/admin/store';

export default withAdminApi(
  async (req, res, user) => {
    const { id } = req.query;
    if (req.method === 'GET') {
      const doc = await getDoc(id);
      return doc ? sendJson(res, 200, { doc }) : sendJson(res, 404, { error: 'Not found' });
    }
    if (req.method === 'PUT') {
      const existing = await getDoc(id);
      if (!existing) return sendJson(res, 404, { error: 'Not found' });
      const doc = await saveDoc({ ...existing, ...(req.body || {}), id }, user);
      return sendJson(res, 200, { doc });
    }
    const removed = await deleteDoc(id);
    return removed ? sendJson(res, 200, { ok: true }) : sendJson(res, 404, { error: 'Not found' });
  },
  { methods: ['GET', 'PUT', 'DELETE'] }
);
