// Client-safe formatting helpers for the admin UI (no Node imports here).

export function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  const units = ['KB', 'MB', 'GB'];
  let v = n / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v < 10 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

export function formatDate(iso, { withTime = false } = {}) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const opts = { year: 'numeric', month: 'short', day: 'numeric' };
  if (withTime) Object.assign(opts, { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleString('en-GB', opts);
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} d ago`;
  return formatDate(iso);
}

export function fileKind(name = '', contentType = '') {
  const ext = name.split('.').pop().toLowerCase();
  if (contentType.startsWith('image/')) return 'image';
  if (contentType === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'odt', 'rtf', 'pages'].includes(ext)) return 'doc';
  if (['xls', 'xlsx', 'csv', 'numbers', 'ods'].includes(ext)) return 'sheet';
  if (['ppt', 'pptx', 'key', 'odp'].includes(ext)) return 'slides';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
  if (['fig', 'sketch', 'psd', 'ai', 'xd'].includes(ext)) return 'design';
  if (contentType.startsWith('video/')) return 'video';
  if (contentType.startsWith('audio/')) return 'audio';
  if (contentType.startsWith('text/') || ['md', 'txt', 'json'].includes(ext)) return 'text';
  return 'file';
}
