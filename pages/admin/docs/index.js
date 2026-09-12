import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Pin, Plus, Search } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { withAdminPage } from '../../../lib/admin/api';
import { listDocs } from '../../../lib/admin/store';
import { timeAgo } from '../../../lib/admin/format';
import { cn } from '../../../lib/utils';

export const getServerSideProps = withAdminPage(async () => ({ props: { docs: await listDocs() } }));

export default function AdminDocs({ adminUser, storageMode, docs }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');

  const tags = useMemo(() => {
    const counts = {};
    docs.forEach((d) => (d.tags || []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [docs]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs
      .filter((d) => !tag || (d.tags || []).includes(tag))
      .filter(
        (d) =>
          !q ||
          d.title.toLowerCase().includes(q) ||
          (d.excerpt || '').toLowerCase().includes(q) ||
          (d.tags || []).some((t) => t.includes(q))
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [docs, query, tag]);

  return (
    <AdminLayout
      user={adminUser}
      storageMode={storageMode}
      title="Documents"
      actions={
        <Button asChild size="sm">
          <Link href="/admin/docs/new"><Plus className="h-4 w-4" /> New document</Link>
        </Button>
      }
    >
      <div className="mb-5 flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents"
            className="h-10 pl-10 text-sm"
          />
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <TagChip active={!tag} onClick={() => setTag('')}>All</TagChip>
            {tags.map(([t, n]) => (
              <TagChip key={t} active={tag === t} onClick={() => setTag(tag === t ? '' : t)}>
                {t} <span className="text-text-subtle">{n}</span>
              </TagChip>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-16 text-center text-sm text-text-muted">
          {docs.length === 0 ? (
            <>
              Nothing here yet.{' '}
              <Link href="/admin/docs/new" className="text-accent hover:underline">Write the first document</Link>
            </>
          ) : (
            'No documents match.'
          )}
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg-elevated">
          {visible.map((doc) => (
            <li key={doc.id}>
              <Link href={`/admin/docs/${doc.id}`} className="flex gap-3 px-4 py-3.5 transition-colors hover:bg-hover-overlay sm:px-5">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-subtle" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-text">{doc.title}</p>
                    {doc.pinned && <Pin className="h-3 w-3 text-accent" />}
                    {doc.format === 'html' && (
                      <span className="rounded-pill bg-accent-muted px-2 py-0.5 text-[0.6875rem] font-medium text-accent">
                        HTML page
                      </span>
                    )}
                    {(doc.tags || []).map((t) => (
                      <span key={t} className="rounded-pill border border-border px-2 py-0.5 text-[0.6875rem] text-text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                  {doc.excerpt && <p className="mt-0.5 line-clamp-1 text-sm text-text-muted">{doc.excerpt}</p>}
                  <p className="mt-1 text-xs text-text-subtle">
                    Updated {timeAgo(doc.updatedAt)} by {doc.updatedBy}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminLayout>
  );
}

function TagChip({ active, children, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border px-3 py-1 text-xs font-medium transition-colors duration-fast',
        active
          ? 'border-accent/40 bg-accent-muted text-accent'
          : 'border-border text-text-muted hover:border-border-hover hover:text-text'
      )}
      {...props}
    >
      {children}
    </button>
  );
}
