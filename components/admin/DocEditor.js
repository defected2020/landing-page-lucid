import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Pin, Trash2, Eye, PencilLine, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Markdown from './Markdown';
import { api } from '../../lib/admin/client';
import { cn } from '../../lib/utils';

export default function DocEditor({ doc }) {
  const router = useRouter();
  const isNew = !doc;
  const [title, setTitle] = useState(doc?.title || '');
  const [body, setBody] = useState(doc?.body || '');
  const [tags, setTags] = useState((doc?.tags || []).join(', '));
  const [pinned, setPinned] = useState(Boolean(doc?.pinned));
  const [mode, setMode] = useState('write');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function track(setter) {
    return (value) => {
      setter(value);
      setDirty(true);
    };
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const payload = { title, body, tags, pinned };
      const data = isNew
        ? await api('/api/admin/docs', { method: 'POST', body: payload })
        : await api(`/api/admin/docs/${doc.id}`, { method: 'PUT', body: payload });
      setDirty(false);
      router.push(`/admin/docs/${data.doc.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/docs/${doc.id}`, { method: 'DELETE' });
      setDirty(false);
      router.push('/admin/docs');
    } catch (err) {
      setError(err.message);
    }
  }

  function onKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      save();
    }
    if (e.key === 'Tab' && e.target.tagName === 'TEXTAREA') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      track(setBody)(next);
      requestAnimationFrame(() => {
        e.target.selectionStart = selectionStart + 2;
        e.target.selectionEnd = selectionStart + 2;
      });
    }
  }

  return (
    <div className="flex flex-col gap-4" onKeyDown={onKeyDown}>
      <Input
        value={title}
        onChange={(e) => track(setTitle)(e.target.value)}
        placeholder="Document title"
        autoFocus={isNew}
        className="h-14 border-transparent bg-transparent px-2 font-display text-2xl font-bold shadow-none focus-visible:border-border focus-visible:ring-0"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={tags}
          onChange={(e) => track(setTags)(e.target.value)}
          placeholder="Tags, comma separated (e.g. planning, q4, clients)"
          className="h-10 max-w-md text-sm"
        />
        <button
          type="button"
          onClick={() => track(setPinned)(!pinned)}
          className={cn(
            'inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors duration-fast',
            pinned
              ? 'border-accent/40 bg-accent-muted text-accent'
              : 'border-border text-text-muted hover:border-border-hover hover:text-text'
          )}
        >
          <Pin className="h-3.5 w-3.5" /> {pinned ? 'Pinned' : 'Pin to overview'}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-bg-elevated">
        <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
          <div className="flex gap-1">
            {[
              { id: 'write', label: 'Write', icon: PencilLine },
              { id: 'preview', label: 'Preview', icon: Eye },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-fast',
                  mode === id ? 'bg-hover-overlay text-text' : 'text-text-muted hover:text-text'
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
          <span className="hidden text-xs text-text-subtle sm:block">Markdown supported · ⌘S to save</span>
        </div>

        {mode === 'write' ? (
          <textarea
            value={body}
            onChange={(e) => track(setBody)(e.target.value)}
            placeholder={'Start writing…\n\n# Heading\n- [ ] Task\n**bold**, _italic_, `code`, [link](https://…)'}
            spellCheck
            className="block min-h-[60vh] w-full resize-y bg-transparent px-5 py-4 font-mono text-[0.9rem] leading-relaxed text-text placeholder:text-text-subtle focus:outline-none"
          />
        ) : (
          <div className="min-h-[60vh] px-6 py-5">
            <Markdown source={body} />
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving} size="sm">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : isNew ? 'Create document' : 'Save changes'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(isNew ? '/admin/docs' : `/admin/docs/${doc.id}`)}
          >
            Cancel
          </Button>
        </div>
        {!isNew && (
          <Button variant="ghost" size="sm" onClick={remove} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>
    </div>
  );
}
