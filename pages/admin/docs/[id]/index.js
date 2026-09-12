import Link from 'next/link';
import { ArrowLeft, ExternalLink, PencilLine, Pin } from 'lucide-react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Markdown from '../../../../components/admin/Markdown';
import { Button } from '../../../../components/ui/button';
import { withAdminPage } from '../../../../lib/admin/api';
import { getDoc } from '../../../../lib/admin/store';
import { formatDate } from '../../../../lib/admin/format';

export const getServerSideProps = withAdminPage(async ({ params }) => {
  const doc = await getDoc(params.id);
  if (!doc) return { notFound: true };
  return { props: { doc } };
});

export default function ViewDoc({ adminUser, storageMode, doc }) {
  const isHtml = doc.format === 'html';
  const pageUrl = `/api/admin/docs/${doc.id}/html`;
  return (
    <AdminLayout
      user={adminUser}
      storageMode={storageMode}
      pageTitle={doc.title}
      actions={
        <>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/docs"><ArrowLeft className="h-4 w-4" /> Documents</Link>
          </Button>
          {isHtml && (
            <Button asChild size="sm" variant="outline">
              <a href={pageUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" /> Open full page
              </a>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={`/admin/docs/${doc.id}/edit`}><PencilLine className="h-4 w-4" /> Edit</Link>
          </Button>
        </>
      }
    >
      <article className={isHtml ? 'mx-auto max-w-[1200px]' : 'mx-auto max-w-[800px]'}>
        <header className="mb-8 border-b border-border pb-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {doc.pinned && (
              <span className="inline-flex items-center gap-1 rounded-pill border border-accent/30 bg-accent-muted px-2.5 py-0.5 text-xs font-medium text-accent">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
            {(doc.tags || []).map((t) => (
              <Link
                key={t}
                href="/admin/docs"
                className="rounded-pill border border-border px-2.5 py-0.5 text-xs text-text-muted hover:text-text"
              >
                {t}
              </Link>
            ))}
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight">{doc.title}</h1>
          <p className="mt-3 text-sm text-text-subtle">
            Created {formatDate(doc.createdAt)} by {doc.author}
            {doc.updatedAt !== doc.createdAt && (
              <> · Updated {formatDate(doc.updatedAt, { withTime: true })} by {doc.updatedBy}</>
            )}
          </p>
          {doc.source === 'repo' && (
            <p className="mt-2 text-xs text-text-subtle">
              Shipped with the site from <code>{doc.sourceFile}</code>. Editing here saves a copy that
              overrides the repo version.
            </p>
          )}
        </header>
        {isHtml ? (
          <iframe
            src={pageUrl}
            title={doc.title}
            className="h-[calc(100vh-14rem)] min-h-[600px] w-full rounded-lg border border-border bg-bg"
          />
        ) : (
          <Markdown source={doc.body} />
        )}
      </article>
    </AdminLayout>
  );
}
