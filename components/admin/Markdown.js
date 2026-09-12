import { useMemo } from 'react';
import { marked } from 'marked';
import { cn } from '../../lib/utils';

marked.use({ gfm: true, breaks: true });

// Renders markdown written by signed-in team members. Content is trusted
// (authors are staff), so no HTML sanitiser is applied; do not reuse this for
// anything a visitor can submit.
export default function Markdown({ source, className }) {
  const html = useMemo(() => marked.parse(source || ''), [source]);
  if (!source || !source.trim()) {
    return <p className={cn('text-text-subtle italic', className)}>Nothing written yet.</p>;
  }
  return <div className={cn('admin-prose', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
