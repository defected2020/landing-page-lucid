import { withAdminApi, sendJson } from '../../../../lib/admin/api';
import { listDocs, saveDoc } from '../../../../lib/admin/store';

export default withAdminApi(
  async (req, res, user) => {
    if (req.method === 'GET') {
      return sendJson(res, 200, { docs: await listDocs() });
    }
    const { id, ...input } = req.body || {};
    const doc = await saveDoc(input, user); // id ignored on POST: always creates
    return sendJson(res, 201, { doc });
  },
  { methods: ['GET', 'POST'] }
);
