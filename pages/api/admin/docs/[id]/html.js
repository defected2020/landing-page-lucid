import { withAdminApi, sendJson } from '../../../../../lib/admin/api';
import { getDoc } from '../../../../../lib/admin/store';

// Serves an HTML-format document as a page of its own, for the viewer frame
// and for "Open full page". Same auth as every other admin route.
export default withAdminApi(
  async (req, res) => {
    const doc = await getDoc(req.query.id);
    if (!doc) return sendJson(res, 404, { error: 'Not found' });
    if (doc.format !== 'html') {
      res.redirect(302, `/admin/docs/${doc.id}`);
      return undefined;
    }
    res.status(200);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
    res.send(doc.body);
    return undefined;
  },
  { methods: ['GET'] }
);
