// Minimal key/value object store with two drivers, chosen at runtime:
//
//   blob   - Vercel Blob (private access). Used when BLOB_READ_WRITE_TOKEN is
//            set, which Vercel injects automatically once a Blob store is
//            attached to the project.
//   local  - Plain files under ./.admin-data (git-ignored). Used for local
//            development so `npm run dev` works with zero setup.
//
// Everything above this layer (documents, files, the index) is driver
// agnostic, so the local driver exercises the same code paths as production.

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Readable } from 'stream';

export class PreconditionFailed extends Error {
  constructor() {
    super('Object changed since it was read');
    this.name = 'PreconditionFailed';
  }
}

export function storageMode() {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'local';
}

/* ───────────────────────── local driver ───────────────────────── */

const LOCAL_ROOT = path.join(process.cwd(), '.admin-data');

function localPath(key) {
  const safe = key.split('/').filter((p) => p && p !== '..' && p !== '.');
  return path.join(LOCAL_ROOT, ...safe);
}

function localEtag(stat) {
  return `${stat.size}-${Math.floor(stat.mtimeMs)}`;
}

const localDriver = {
  mode: 'local',

  async getJson(key) {
    const file = localPath(key);
    try {
      const [buf, stat] = await Promise.all([fsp.readFile(file, 'utf8'), fsp.stat(file)]);
      return { data: JSON.parse(buf), etag: localEtag(stat) };
    } catch (err) {
      if (err.code === 'ENOENT') return null;
      throw err;
    }
  },

  async putJson(key, data, { ifMatch } = {}) {
    const file = localPath(key);
    await fsp.mkdir(path.dirname(file), { recursive: true });
    if (ifMatch !== undefined) {
      let current = null;
      try {
        current = localEtag(await fsp.stat(file));
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }
      if (current !== ifMatch) throw new PreconditionFailed();
    }
    // Write then rename so a crash never leaves a half-written index.
    const tmp = `${file}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    await fsp.writeFile(tmp, JSON.stringify(data, null, 2));
    await fsp.rename(tmp, file);
    return { etag: localEtag(await fsp.stat(file)) };
  },

  async putBinary(key, body) {
    const file = localPath(key);
    await fsp.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    if (Buffer.isBuffer(body)) {
      await fsp.writeFile(tmp, body);
    } else {
      await new Promise((resolve, reject) => {
        const out = fs.createWriteStream(tmp);
        body.on('error', reject);
        out.on('error', reject);
        out.on('finish', resolve);
        body.pipe(out);
      });
    }
    await fsp.rename(tmp, file);
    const stat = await fsp.stat(file);
    return { size: stat.size };
  },

  async getBinary(key) {
    const file = localPath(key);
    try {
      const stat = await fsp.stat(file);
      return { stream: fs.createReadStream(file), size: stat.size };
    } catch (err) {
      if (err.code === 'ENOENT') return null;
      throw err;
    }
  },

  async remove(keys) {
    await Promise.all(
      [].concat(keys).map(async (key) => {
        const file = localPath(key);
        try {
          await fsp.unlink(file);
          // Uploads live in a folder per id; drop it once empty.
          if (key.startsWith('admin/uploads/')) await fsp.rmdir(path.dirname(file)).catch(() => {});
        } catch (err) {
          if (err.code !== 'ENOENT') throw err;
        }
      })
    );
  },
};

/* ───────────────────────── blob driver ───────────────────────── */

async function blobSdk() {
  return import('@vercel/blob');
}

async function readStreamToString(stream) {
  const chunks = [];
  for await (const chunk of Readable.fromWeb(stream)) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const blobDriver = {
  mode: 'blob',

  async getJson(key) {
    const { get } = await blobSdk();
    const res = await get(key, { access: 'private', useCache: false });
    if (!res || !res.stream) return null;
    const text = await readStreamToString(res.stream);
    return { data: JSON.parse(text), etag: res.blob.etag };
  },

  async putJson(key, data, { ifMatch } = {}) {
    const { put, BlobPreconditionFailedError } = await blobSdk();
    const opts = {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    };
    // ifMatch === null means "must not exist yet"; the SDK has no such mode, so
    // only pass a real etag through.
    if (ifMatch) opts.ifMatch = ifMatch;
    try {
      const res = await put(key, JSON.stringify(data), opts);
      return { etag: res.etag };
    } catch (err) {
      if (err instanceof BlobPreconditionFailedError) throw new PreconditionFailed();
      throw err;
    }
  },

  async putBinary(key, body, contentType) {
    const { put } = await blobSdk();
    const res = await put(key, body, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: contentType || 'application/octet-stream',
    });
    return { size: res.size ?? null };
  },

  async getBinary(key) {
    const { get } = await blobSdk();
    const res = await get(key, { access: 'private' });
    if (!res || !res.stream) return null;
    return {
      stream: Readable.fromWeb(res.stream),
      size: res.blob.size,
      contentType: res.blob.contentType,
    };
  },

  async remove(keys) {
    const { del } = await blobSdk();
    const list = [].concat(keys);
    if (list.length) await del(list);
  },
};

export function getObjectStore() {
  return storageMode() === 'blob' ? blobDriver : localDriver;
}
