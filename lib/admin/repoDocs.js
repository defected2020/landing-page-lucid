// Documents shipped inside the repository (see content/adminDocs.js).
// Server-only: reads from the filesystem.

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import manifest from '../../content/adminDocs';

// Stable 16-hex id derived from the file name, so it satisfies the same id
// rules as stored docs and survives redeploys.
export function repoDocId(file) {
  return crypto.createHash('sha256').update(`repo-doc:${file}`).digest('hex').slice(0, 16);
}

function loadOne(entry) {
  const file = path.join(process.cwd(), entry.file);
  let body;
  let stat;
  try {
    body = fs.readFileSync(file, 'utf8');
    stat = fs.statSync(file);
  } catch (err) {
    console.error(`[admin] repo doc ${entry.file} could not be read:`, err.message);
    return null;
  }
  const mtime = stat.mtime.toISOString();
  return {
    id: repoDocId(entry.file),
    title: entry.title || entry.file,
    body,
    format: entry.format === 'html' ? 'html' : 'markdown',
    tags: entry.tags || [],
    pinned: Boolean(entry.pinned),
    author: 'repository',
    updatedBy: 'repository',
    createdAt: mtime,
    updatedAt: mtime,
    source: 'repo',
    sourceFile: entry.file,
  };
}

export function listRepoDocs() {
  return manifest.map(loadOne).filter(Boolean);
}

export function getRepoDoc(id) {
  const entry = manifest.find((e) => repoDocId(e.file) === id);
  return entry ? loadOne(entry) : null;
}
