// Small helpers shared by the admin API routes and pages.
import { getSessionUser, isAuthConfigured } from './auth';
import { storageMode } from './objectStore';

export function sendJson(res, status, data) {
  res.status(status).setHeader('Cache-Control', 'no-store');
  res.json(data);
}

/** Wraps an API handler: rejects unauthenticated calls, catches errors. */
export function withAdminApi(handler, { methods } = {}) {
  return async function adminApiHandler(req, res) {
    if (methods && !methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));
      return sendJson(res, 405, { error: 'Method not allowed' });
    }
    const user = getSessionUser(req);
    if (!user) return sendJson(res, 401, { error: 'Not signed in' });
    try {
      return await handler(req, res, user);
    } catch (err) {
      console.error(`[admin api] ${req.method} ${req.url}:`, err);
      return sendJson(res, 500, { error: err.message || 'Server error' });
    }
  };
}

/**
 * Wraps getServerSideProps for admin pages: redirects to the login page when
 * there is no session and injects `adminUser` + `storageMode` into props.
 */
export function withAdminPage(loader) {
  return async function adminPageProps(ctx) {
    const user = getSessionUser(ctx.req);
    if (!user) {
      const next = encodeURIComponent(ctx.resolvedUrl || '/admin');
      return { redirect: { destination: `/admin/login?next=${next}`, permanent: false } };
    }
    ctx.res.setHeader('Cache-Control', 'no-store');
    const result = loader ? await loader(ctx, user) : { props: {} };
    if (!result || !result.props) return result;
    return {
      ...result,
      props: {
        adminUser: user,
        storageMode: storageMode(),
        authConfigured: isAuthConfigured(),
        ...result.props,
      },
    };
  };
}
