import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { uploadFile } from '../../lib/admin/client';
import { cn } from '../../lib/utils';

export default function FileUploader({ storageMode, onUploaded }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState([]); // { name, progress, error }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setQueue((q) => [...q, ...files.map((f) => ({ name: f.name, progress: 0, error: '' }))]);

    for (const file of files) {
      const update = (patch) =>
        setQueue((q) => q.map((item) => (item.name === file.name ? { ...item, ...patch } : item)));
      try {
        const record = await uploadFile(file, {
          mode: storageMode,
          onProgress: (p) => update({ progress: p }),
        });
        update({ progress: 1 });
        onUploaded?.(record);
        setTimeout(() => setQueue((q) => q.filter((item) => item.name !== file.name)), 1200);
      } catch (err) {
        update({ error: err.message || 'Upload failed' });
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center transition-colors duration-fast',
          dragging
            ? 'border-accent bg-accent-muted'
            : 'border-border bg-bg-elevated hover:border-border-hover hover:bg-hover-overlay'
        )}
      >
        <UploadCloud className={cn('h-7 w-7', dragging ? 'text-accent' : 'text-text-subtle')} />
        <p className="text-sm font-medium text-text">Drop files here, or click to choose</p>
        <p className="text-xs text-text-subtle">
          PDFs, spreadsheets, decks, images, archives. Up to 500 MB per file.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {queue.length > 0 && (
        <ul className="flex flex-col gap-2">
          {queue.map((item) => (
            <li
              key={item.name}
              className="rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-text">{item.name}</span>
                <span className={cn('flex-shrink-0 text-xs', item.error ? 'text-destructive' : 'text-text-subtle')}>
                  {item.error || (item.progress >= 1 ? 'Done' : `${Math.round(item.progress * 100)}%`)}
                </span>
              </div>
              {!item.error && (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-bg-subtle">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-fast"
                    style={{ width: `${Math.round(item.progress * 100)}%` }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
