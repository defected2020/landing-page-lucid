import { useMemo, useState } from 'react';
import { Download, Search, Trash2, Eye, Check, X, PencilLine } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import FileUploader from '../../components/admin/FileUploader';
import { Input } from '../../components/ui/input';
import { withAdminPage } from '../../lib/admin/api';
import { listFiles } from '../../lib/admin/store';
import { api } from '../../lib/admin/client';
import { formatBytes, formatDate, fileKind } from '../../lib/admin/format';

export const getServerSideProps = withAdminPage(async () => ({ props: { initialFiles: await listFiles() } }));

const PREVIEWABLE = new Set(['image', 'pdf', 'text', 'video', 'audio']);

export default function AdminFiles({ adminUser, storageMode, initialFiles }) {
  const [files, setFiles] = useState(initialFiles);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter(
      (f) => !q || f.name.toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q)
    );
  }, [files, query]);

  async function remove(file) {
    if (!window.confirm(`Delete "${file.name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/files/${file.id}`, { method: 'DELETE' });
      setFiles((list) => list.filter((f) => f.id !== file.id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveDescription(file, description) {
    try {
      const data = await api(`/api/admin/files/${file.id}`, { method: 'PATCH', body: { description } });
      setFiles((list) => list.map((f) => (f.id === file.id ? data.file : f)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminLayout user={adminUser} storageMode={storageMode} title="Files">
      <div className="mb-6">
        <FileUploader
          storageMode={storageMode}
          onUploaded={(record) => setFiles((list) => [record, ...list.filter((f) => f.id !== record.id)])}
        />
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files"
            className="h-10 pl-10 text-sm"
          />
        </div>
        <p className="text-sm text-text-subtle">
          {files.length} file{files.length === 1 ? '' : 's'} ·{' '}
          {formatBytes(files.reduce((n, f) => n + (f.size || 0), 0))}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-16 text-center text-sm text-text-muted">
          {files.length === 0 ? 'No files uploaded yet.' : 'No files match.'}
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-bg-elevated">
          {visible.map((file) => (
            <FileRow key={file.id} file={file} onDelete={remove} onSaveDescription={saveDescription} />
          ))}
        </ul>
      )}
    </AdminLayout>
  );
}

function FileRow({ file, onDelete, onSaveDescription }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(file.description || '');
  const kind = fileKind(file.name, file.contentType);

  return (
    <li className="flex flex-wrap items-start gap-3 px-4 py-3.5 sm:px-5">
      <span className="mt-0.5 flex h-8 w-11 flex-shrink-0 items-center justify-center rounded border border-border bg-bg-subtle text-[0.625rem] font-semibold uppercase tracking-wide text-text-muted">
        {kind}
      </span>
      <div className="min-w-0 flex-1">
        <a
          href={`/api/admin/files/download/${file.id}`}
          className="block truncate font-medium text-text hover:text-accent"
        >
          {file.name}
        </a>
        {editing ? (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Input
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSaveDescription(file, draft);
                  setEditing(false);
                }
                if (e.key === 'Escape') setEditing(false);
              }}
              placeholder="Short description"
              className="h-8 max-w-md text-sm"
            />
            <IconButton
              label="Save"
              onClick={() => {
                onSaveDescription(file, draft);
                setEditing(false);
              }}
            >
              <Check className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton label="Cancel" onClick={() => setEditing(false)}>
              <X className="h-3.5 w-3.5" />
            </IconButton>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="group mt-0.5 flex items-center gap-1.5 text-left text-sm text-text-muted hover:text-text"
          >
            {file.description || <span className="italic text-text-subtle">Add a description</span>}
            <PencilLine className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}
        <p className="mt-1 text-xs text-text-subtle">
          {formatBytes(file.size)} · {file.author} · {formatDate(file.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-1">
        {PREVIEWABLE.has(kind) && (
          <IconButton label="Preview" href={`/api/admin/files/download/${file.id}?inline=1`} target="_blank">
            <Eye className="h-3.5 w-3.5" />
          </IconButton>
        )}
        <IconButton label="Download" href={`/api/admin/files/download/${file.id}`}>
          <Download className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Delete" onClick={() => onDelete(file)} danger>
          <Trash2 className="h-3.5 w-3.5" />
        </IconButton>
      </div>
    </li>
  );
}

function IconButton({ label, href, danger, children, ...props }) {
  const className = `flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted transition-colors duration-fast hover:border-border-hover ${
    danger ? 'hover:text-destructive' : 'hover:text-text'
  }`;
  if (href) {
    return (
      <a href={href} aria-label={label} title={label} className={className} rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" aria-label={label} title={label} className={className} {...props}>
      {children}
    </button>
  );
}
