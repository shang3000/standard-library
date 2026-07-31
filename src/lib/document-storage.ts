import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { validateDocumentFile } from './document-file-rules';

const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'documents');
export { validateDocumentFile } from './document-file-rules';

export async function saveDocumentFile(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  const storageKey = `${randomUUID()}${extension}`;
  await fs.mkdir(STORAGE_ROOT, { recursive: true });
  await fs.writeFile(path.join(STORAGE_ROOT, storageKey), Buffer.from(await file.arrayBuffer()));
  return { storageKey, originalName: path.basename(file.name), mimeType: file.type, fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB` };
}

export async function readDocumentFile(storageKey: string) {
  return fs.readFile(path.join(STORAGE_ROOT, path.basename(storageKey)));
}

export async function deleteDocumentFile(storageKey: string) {
  try {
    await fs.unlink(path.join(STORAGE_ROOT, path.basename(storageKey)));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}
