// Documents and files for the admin area, built on the object store.
//
// Layout (same keys in both drivers):
//   admin/index.json              small index of every doc + file (metadata only)
//   admin/docs/<id>.json          full document incl. markdown body
//   admin/uploads/<id>/<name>     uploaded binaries
//
// The index is updated with optimistic concurrency (etag + retry) so two
// people saving at the same moment cannot wipe each other's entry.

import crypto from 'crypto';
import path from 'path';
import { getObjectStore, PreconditionFailed } from './objectStore';
import { listRepoDocs, getRepoDoc } from './repoDocs';

const INDEX_KEY = 'admin/index.json';
const EMPTY_INDEX = { version: 1, docs: {}, files: {} };

export const MAX_UPLOAD_BYTES = 500 * 1024 * 1024; // 500 MB, Blob's client-upload ceiling is far above this

export function newId() {
  return crypto.randomBytes(8).toString('hex');
}

export function safeFileName(name) {
  const base = path.basename(String(name || 'file')).replace(/[\\/:*?"<>|\x00-\x1f]/g, '_');
  return base.slice(0, 180) || 'file';
}

export function uploadKey(id, name) {
  return `admin/uploads/${id}/${safeFileName(name)}`;
}

function docKey(id) {
  return `admin/docs/${id}.json`;
}

function isValidId(id) {
  return typeof id === 'string' && /^[a-f0-9]{16}$/.test(id);
}

async function readIndex() {
  const store = getObjectStore();
  const res = await store.getJson(INDEX_KEY);
  if (!res) return { data: { ...EMPTY_INDEX, docs: {}, files: {} }, etag: null };
  return { data: { ...EMPTY_INDEX, ...res.data }, etag: res.etag };
}

/** Read-modify-write the index with etag protection and a few retries. */
async function updateIndex(mutate) {
  const store = getObjectStore();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { data, etag } = await readIndex();
    const next = mutate(data) || data;
    try {
      await store.putJson(INDEX_KEY, next, etag ? { ifMatch: etag } : {});
      return next;
    } catch (err) {
      if (!(err instanceof PreconditionFailed) || attempt === 4) throw err;
    }
  }
  return null;
}

function normalizeTags(tags) {
  const list = Array.isArray(tags) ? tags : String(tags || '').split(',');
  return [...new Set(list.map((t) => String(t).trim().toLowerCase()).filter(Boolean))].slice(0, 20);
}

export function normalizeFormat(format) {
  return format === 'html' ? 'html' : 'markdown';
}

function excerpt(body, format) {
  let text = String(body || '');
  if (format === 'html') {
    text = text
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z#0-9]+;/gi, ' ');
  }
  return text
    .replace(/^#+\s*/gm, '')
    .replace(/[*_`>#\[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

function sortByUpdated(list) {
  return list.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

/* ───────────────────────── documents ───────────────────────── */

// Repo-shipped docs (content/adminDocs.js) are listed alongside stored ones.
// A stored doc with the same id is an edited copy and wins.
export async function listDocs() {
  const { data } = await readIndex();
  const merged = {};
  listRepoDocs().forEach((doc) => {
    const { body, ...meta } = doc;
    merged[doc.id] = { ...meta, excerpt: excerpt(body, doc.format) };
  });
  Object.values(data.docs).forEach((doc) => {
    merged[doc.id] = doc;
  });
  return sortByUpdated(Object.values(merged));
}

export async function getDoc(id) {
  if (!isValidId(id)) return null;
  const res = await getObjectStore().getJson(docKey(id));
  if (res) return res.data;
  return getRepoDoc(id);
}

export async function saveDoc(input, user) {
  const now = new Date().toISOString();
  const id = isValidId(input.id) ? input.id : newId();
  const existing = isValidId(input.id) ? await getDoc(input.id) : null;

  const doc = {
    id,
    title: String(input.title || '').trim().slice(0, 200) || 'Untitled',
    body: String(input.body || ''),
    format: normalizeFormat(input.format),
    tags: normalizeTags(input.tags),
    pinned: Boolean(input.pinned),
    author: existing?.author || user?.name || 'unknown',
    updatedBy: user?.name || 'unknown',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await getObjectStore().putJson(docKey(id), doc);
  await updateIndex((index) => {
    index.docs[id] = {
      id,
      title: doc.title,
      format: doc.format,
      tags: doc.tags,
      pinned: doc.pinned,
      author: doc.author,
      updatedBy: doc.updatedBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      excerpt: excerpt(doc.body, doc.format),
    };
  });
  return doc;
}

export async function deleteDoc(id) {
  if (!isValidId(id)) return false;
  let found = false;
  await updateIndex((index) => {
    found = Boolean(index.docs[id]);
    delete index.docs[id];
  });
  await getObjectStore().remove(docKey(id));
  return found;
}

/* ───────────────────────── files ───────────────────────── */

export async function listFiles() {
  const { data } = await readIndex();
  return sortByUpdated(Object.values(data.files));
}

export async function getFileRecord(id) {
  if (!isValidId(id)) return null;
  const { data } = await readIndex();
  return data.files[id] || null;
}

/** Records a file that already exists in the object store under `key`. */
export async function registerFile({ id, name, size, contentType, description }, user) {
  if (!isValidId(id)) throw new Error('Invalid file id');
  const now = new Date().toISOString();
  const cleanName = safeFileName(name);
  const record = {
    id,
    name: cleanName,
    key: uploadKey(id, cleanName),
    size: Number(size) || 0,
    contentType: String(contentType || 'application/octet-stream').slice(0, 120),
    description: String(description || '').trim().slice(0, 500),
    author: user?.name || 'unknown',
    createdAt: now,
    updatedAt: now,
  };
  await updateIndex((index) => {
    index.files[id] = record;
  });
  return record;
}

export async function updateFileRecord(id, patch) {
  let updated = null;
  await updateIndex((index) => {
    const current = index.files[id];
    if (!current) return;
    updated = {
      ...current,
      description: patch.description !== undefined
        ? String(patch.description).trim().slice(0, 500)
        : current.description,
      updatedAt: new Date().toISOString(),
    };
    index.files[id] = updated;
  });
  return updated;
}

export async function deleteFile(id) {
  const record = await getFileRecord(id);
  if (!record) return false;
  await getObjectStore().remove(record.key);
  await updateIndex((index) => {
    delete index.files[id];
  });
  return true;
}

/** Server-side upload (local dev, or small files). `body` is a Buffer or Node stream. */
export async function storeUpload({ name, contentType, body, description }, user) {
  const id = newId();
  const cleanName = safeFileName(name);
  const { size } = await getObjectStore().putBinary(uploadKey(id, cleanName), body, contentType);
  return registerFile({ id, name: cleanName, size, contentType, description }, user);
}

export async function openFile(id) {
  const record = await getFileRecord(id);
  if (!record) return null;
  const obj = await getObjectStore().getBinary(record.key);
  if (!obj) return null;
  return { record, ...obj };
}
