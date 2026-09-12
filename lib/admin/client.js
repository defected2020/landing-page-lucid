// Browser-side helpers for talking to the admin API.

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new Error('Not signed in');
  }
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

function putWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        data = null;
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data?.error || `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });
}

/**
 * Uploads one file and returns its record.
 * - blob mode: browser → Vercel Blob directly (no size limit from our API),
 *   then metadata is registered with our API.
 * - local mode: streamed to our API which writes it to disk.
 */
export async function uploadFile(file, { mode, onProgress } = {}) {
  if (mode === 'blob') {
    const { upload } = await import('@vercel/blob/client');
    const slot = await api(`/api/admin/files/upload?name=${encodeURIComponent(file.name)}`);
    await upload(slot.pathname, file, {
      access: 'private',
      handleUploadUrl: '/api/admin/files/upload',
      clientPayload: JSON.stringify({ id: slot.id }),
      contentType: file.type || 'application/octet-stream',
      multipart: file.size > 50 * 1024 * 1024,
      onUploadProgress: (p) => onProgress && onProgress((p.percentage || 0) / 100),
    });
    const { file: record } = await api('/api/admin/files', {
      method: 'POST',
      body: { id: slot.id, name: slot.name, size: file.size, contentType: file.type },
    });
    return record;
  }

  const query = `name=${encodeURIComponent(file.name)}&type=${encodeURIComponent(
    file.type || 'application/octet-stream'
  )}`;
  const data = await putWithProgress(`/api/admin/files/upload?${query}`, file, onProgress);
  return data.file;
}
