import Link from 'next/link';
import { FileText, FolderOpen, Pin, Plus, Upload, ArrowRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { withAdminPage } from '../../lib/admin/api';
import { listDocs, listFiles } from '../../lib/admin/store';
import { formatBytes, timeAgo, fileKind } from '../../lib/admin/format';

export const getServerSideProps = withAdminPage(async () => {
  const [docs, files] = await Promise.all([listDocs(), listFiles()]);
  return { props: { docs, files } };
});

function Stat({ icon: Icon, label, value, href }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border border-border bg-bg-elevated p-5 transition-colors duration-fast hover:border-border-hover"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-muted text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-2xl font-bold leading-none">{value}</p>
        <p className="mt-1 text-sm text-text-muted">{label}</p>
      </div>
    </Link>
  );
}

function SectionHeader({ title, href, linkLabel }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm text-text-muted hover:text-text">
          {linkLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

export default function AdminOverview({ adminUser, storageMode, docs, files }) {
  const pinned = docs.filter((d) => d.pinned);
  const recentDocs = docs.slice(0, 6);
  const recentFiles = files.slice(0, 6);

  return (
    <AdminLayout
      user={adminUser}
      storageMode={storageMode}
      title="Overview"
      actions={
        <>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/files"><Upload className="h-4 w-4" /> Upload file</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/docs/new"><Plus className="h-4 w-4" /> New document</Link>
          </Button>
        </>
      }
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Stat icon={FileText} label="Documents" value={docs.length} href="/admin/docs" />
        <Stat icon={FolderOpen} label="Files" value={files.length} href="/admin/files" />
      </div>

      {pinned.length > 0 && (
        <section className="mb-8">
          <SectionHeader title="Pinned" />
          <div className="grid gap-3 sm:grid-cols-2">
            {pinned.map((doc) => (
              <Link
                key={doc.id}
                href={`/admin/docs/${doc.id}`}
                className="group rounded-lg border border-[color:var(--highlight-border)] bg-highlight p-4 transition-colors duration-fast hover:border-accent/40"
              >
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-accent">
                  <Pin className="h-3 w-3" /> Pinned
                </div>
                <h3 className="font-display text-[1.0625rem] font-semibold leading-snug text-text">{doc.title}</h3>
                {doc.excerpt && <p className="mt-1 line-clamp-2 text-sm text-text-muted">{doc.excerpt}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionHeader title="Recent documents" href="/admin/docs" linkLabel="All documents" />
          {recentDocs.length === 0 ? (
            <EmptyHint text="No documents yet." href="/admin/docs/new" cta="Write the first one" />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg-elevated">
              {recentDocs.map((doc) => (
                <li key={doc.id}>
                  <Link href={`/admin/docs/${doc.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-hover-overlay">
                    <FileText className="h-4 w-4 flex-shrink-0 text-text-subtle" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">{doc.title}</p>
                      <p className="text-xs text-text-subtle">
                        {doc.updatedBy} · {timeAgo(doc.updatedAt)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <SectionHeader title="Recent files" href="/admin/files" linkLabel="All files" />
          {recentFiles.length === 0 ? (
            <EmptyHint text="No files yet." href="/admin/files" cta="Upload something" />
          ) : (
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg-elevated">
              {recentFiles.map((file) => (
                <li key={file.id}>
                  <a
                    href={`/api/admin/files/download/${file.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-hover-overlay"
                  >
                    <span className="flex h-7 w-9 flex-shrink-0 items-center justify-center rounded border border-border bg-bg-subtle text-[0.6rem] font-semibold uppercase tracking-wide text-text-muted">
                      {fileKind(file.name, file.contentType)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text">{file.name}</p>
                      <p className="text-xs text-text-subtle">
                        {formatBytes(file.size)} · {file.author} · {timeAgo(file.createdAt)}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

function EmptyHint({ text, href, cta }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted">
      {text}{' '}
      <Link href={href} className="text-accent hover:underline">
        {cta}
      </Link>
    </div>
  );
}
