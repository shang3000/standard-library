import 'server-only';

import bcrypt from 'bcryptjs';
import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import { categories as catalogCategories, documents as catalogDocuments } from './data';
import type { Category, DocFormat, Document } from '@/types';

type Row = Record<string, unknown>;

export interface StoredUser {
  id: number;
  username: string;
  email: string | null;
  passwordHash: string;
  isVip: boolean;
  starsBalance: number;
  createdAt: string;
}

export interface StoredDocument {
  id: number;
  title: string;
  categoryId: number;
  category: string;
  format: DocFormat;
  pages: number;
  fileSize: string;
  storageKey: string | null;
  originalName: string | null;
  mimeType: string | null;
  priceStars: number;
  downloadCount: number;
  uploadTime: string;
  description: string;
  isVip: boolean;
}

const databaseKey = Symbol.for('standard-library.sqljs.database');
const databasePromiseKey = Symbol.for('standard-library.sqljs.database-promise');
type SqlJsGlobal = typeof globalThis & {
  [databaseKey]?: Database;
  [databasePromiseKey]?: Promise<Database>;
};
const runtimeGlobal = globalThis as SqlJsGlobal;

function rows<T extends Row>(database: Database, sql: string, params: unknown[] = []): T[] {
  const result = database.exec(sql, params);
  if (!result[0]) return [];
  return result[0].values.map((values) => Object.fromEntries(result[0].columns.map((column, index) => [column, values[index]])) as T);
}

function first<T extends Row>(database: Database, sql: string, params: unknown[] = []): T | null {
  return rows<T>(database, sql, params)[0] ?? null;
}

function numberValue(value: unknown) { return Number(value ?? 0); }
function stringValue(value: unknown) { return String(value ?? ''); }
function boolValue(value: unknown) { return Boolean(numberValue(value)); }

function toDocument(row: Row): Document {
  return {
    id: stringValue(row.id),
    title: stringValue(row.title),
    category: stringValue(row.category_name),
    categorySlug: stringValue(row.category_slug),
    categoryId: stringValue(row.category_id),
    format: stringValue(row.format) as DocFormat,
    price: numberValue(row.price_stars),
    isVip: boolValue(row.is_vip),
    pages: numberValue(row.pages),
    size: stringValue(row.file_size),
    uploadDate: stringValue(row.upload_time).slice(0, 10),
    downloadCount: numberValue(row.download_count),
    description: stringValue(row.description),
  };
}

function toStoredDocument(row: Row): StoredDocument {
  return {
    id: numberValue(row.id), title: stringValue(row.title), categoryId: numberValue(row.category_id),
    category: stringValue(row.category_name), format: stringValue(row.format) as DocFormat,
    pages: numberValue(row.pages), fileSize: stringValue(row.file_size), storageKey: row.storage_key ? stringValue(row.storage_key) : null,
    originalName: row.original_name ? stringValue(row.original_name) : null, mimeType: row.mime_type ? stringValue(row.mime_type) : null,
    priceStars: numberValue(row.price_stars), downloadCount: numberValue(row.download_count), uploadTime: stringValue(row.upload_time),
    description: stringValue(row.description), isVip: boolValue(row.is_vip),
  };
}

function toStoredUser(row: Row): StoredUser {
  return { id: numberValue(row.id), username: stringValue(row.username), email: row.email ? stringValue(row.email) : null, passwordHash: stringValue(row.password_hash), isVip: boolValue(row.is_vip), starsBalance: numberValue(row.stars_balance), createdAt: stringValue(row.created_at) };
}

const documentSelect = `
  SELECT d.*, c.name AS category_name, c.slug AS category_slug
  FROM documents d JOIN categories c ON c.id = d.category_id
`;

async function createDatabase() {
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
  });
  const database = new SQL.Database();
  database.run('PRAGMA foreign_keys = ON');
  database.run(`CREATE TABLE categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE, icon TEXT, description TEXT)`);
  database.run(`CREATE TABLE documents (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, category_id INTEGER NOT NULL, format TEXT NOT NULL, pages INTEGER NOT NULL DEFAULT 0, file_size TEXT, storage_key TEXT UNIQUE, original_name TEXT, mime_type TEXT, price_stars INTEGER NOT NULL DEFAULT 0, download_count INTEGER NOT NULL DEFAULT 0, upload_time TEXT NOT NULL, description TEXT, is_vip INTEGER NOT NULL DEFAULT 0, FOREIGN KEY (category_id) REFERENCES categories(id))`);
  database.run(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, email TEXT UNIQUE, is_vip INTEGER NOT NULL DEFAULT 0, stars_balance INTEGER NOT NULL DEFAULT 50, created_at TEXT NOT NULL)`);
  database.run(`CREATE TABLE downloads (id INTEGER PRIMARY KEY AUTOINCREMENT, doc_id INTEGER NOT NULL, user_id INTEGER NOT NULL, stars_paid INTEGER NOT NULL DEFAULT 0, downloaded_at TEXT NOT NULL, FOREIGN KEY (doc_id) REFERENCES documents(id), FOREIGN KEY (user_id) REFERENCES users(id))`);
  database.run('CREATE INDEX idx_documents_category ON documents(category_id)');
  database.run('CREATE INDEX idx_downloads_user ON downloads(user_id)');

  const insertCategory = database.prepare('INSERT INTO categories (name, slug, icon, description) VALUES (?, ?, ?, ?)');
  for (const category of catalogCategories) insertCategory.run([category.name, category.slug, category.icon, category.description]);
  insertCategory.free();

  const categoryIds = new Map(rows<{ id: number; name: string }>(database, 'SELECT id, name FROM categories').map((category) => [category.name, numberValue(category.id)]));
  const insertDocument = database.prepare('INSERT INTO documents (title, category_id, format, pages, file_size, price_stars, download_count, upload_time, description, is_vip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const seedDocuments = [...catalogDocuments];
  for (let index = 0; seedDocuments.length < 50; index += 1) {
    const source = catalogDocuments[index % catalogDocuments.length];
    seedDocuments.push({ ...source, id: `demo-${index}`, title: `${source.title}（演示资料 ${index + 1}）`, uploadDate: `2024-04-${String((index % 28) + 1).padStart(2, '0')}` });
  }
  for (const document of seedDocuments) {
    insertDocument.run([document.title, categoryIds.get(document.category) ?? 1, document.format, document.pages, document.size, document.price, document.downloadCount, document.uploadDate, document.description, document.isVip ? 1 : 0]);
  }
  insertDocument.free();

  const insertUser = database.prepare('INSERT INTO users (username, password_hash, email, is_vip, stars_balance, created_at) VALUES (?, ?, ?, ?, ?, ?)');
  const passwordHash = await bcrypt.hash('123456', 10);
  const now = new Date().toISOString();
  insertUser.run(['test', passwordHash, 'test@example.com', 0, 100, now]);
  insertUser.run(['vipuser', passwordHash, 'vip@example.com', 1, 500, now]);
  insertUser.free();
  return database;
}

export async function getSqlDatabase() {
  if (runtimeGlobal[databaseKey]) return runtimeGlobal[databaseKey];
  runtimeGlobal[databasePromiseKey] ??= createDatabase().then((database) => {
    runtimeGlobal[databaseKey] = database;
    return database;
  });
  return runtimeGlobal[databasePromiseKey];
}

export async function getCategories(): Promise<Category[]> {
  const database = await getSqlDatabase();
  return rows<Row>(database, `SELECT c.*, COUNT(d.id) AS count FROM categories c LEFT JOIN documents d ON d.category_id = c.id GROUP BY c.id ORDER BY c.id`).map((row) => ({ id: stringValue(row.id), name: stringValue(row.name), slug: stringValue(row.slug), icon: stringValue(row.icon), description: stringValue(row.description), count: numberValue(row.count) }));
}

export async function getLatestDocuments(limit = 8, offset = 0) { const db = await getSqlDatabase(); return rows<Row>(db, `${documentSelect} ORDER BY d.upload_time DESC LIMIT ? OFFSET ?`, [limit, offset]).map(toDocument); }
export async function getPopularDocuments(limit = 10) { const db = await getSqlDatabase(); return rows<Row>(db, `${documentSelect} ORDER BY d.download_count DESC, d.id DESC LIMIT ?`, [limit]).map(toDocument); }
export async function getDocumentById(id: string) { const db = await getSqlDatabase(); const row = first<Row>(db, `${documentSelect} WHERE d.id = ?`, [Number(id)]); return row ? toDocument(row) : undefined; }
export async function getRelatedDocuments(categoryId: number, excludeId: string, limit = 4) { const db = await getSqlDatabase(); return rows<Row>(db, `${documentSelect} WHERE d.category_id = ? AND d.id <> ? ORDER BY d.download_count DESC LIMIT ?`, [categoryId, Number(excludeId), limit]).map(toDocument); }

export async function getDocumentsByCategory(slug: string, limit = 20, offset = 0, filters?: { formats?: DocFormat[]; isFree?: boolean; isVip?: boolean; sort?: string }) {
  const db = await getSqlDatabase();
  const clauses = ['c.slug = ?']; const params: unknown[] = [slug];
  if (filters?.formats?.length) { clauses.push(`d.format IN (${filters.formats.map(() => '?').join(', ')})`); params.push(...filters.formats); }
  if (filters?.isFree) clauses.push('d.price_stars = 0');
  if (filters?.isVip) clauses.push('d.is_vip = 1');
  const where = clauses.join(' AND ');
  const order = filters?.sort === 'downloads' ? 'd.download_count DESC' : filters?.sort === 'price_asc' ? 'd.price_stars ASC' : filters?.sort === 'price_desc' ? 'd.price_stars DESC' : 'd.upload_time DESC';
  const total = numberValue(first<Row>(db, `SELECT COUNT(*) AS total FROM documents d JOIN categories c ON c.id = d.category_id WHERE ${where}`, params)?.total);
  return { documents: rows<Row>(db, `${documentSelect} WHERE ${where} ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]).map(toDocument), total };
}

export async function searchDocuments(keyword: string, limit = 20, offset = 0) {
  const db = await getSqlDatabase(); const value = `%${keyword}%`;
  const where = '(d.title LIKE ? OR d.description LIKE ? OR c.name LIKE ?)'; const params = [value, value, value];
  const total = numberValue(first<Row>(db, `SELECT COUNT(*) AS total FROM documents d JOIN categories c ON c.id = d.category_id WHERE ${where}`, params)?.total);
  return { documents: rows<Row>(db, `${documentSelect} WHERE ${where} ORDER BY d.download_count DESC LIMIT ? OFFSET ?`, [...params, limit, offset]).map(toDocument), total };
}

export async function getStoredUserById(id: number) { const db = await getSqlDatabase(); const row = first<Row>(db, 'SELECT * FROM users WHERE id = ?', [id]); return row ? toStoredUser(row) : null; }
export async function getStoredUserByUsername(username: string) { const db = await getSqlDatabase(); const row = first<Row>(db, 'SELECT * FROM users WHERE username = ?', [username]); return row ? toStoredUser(row) : null; }
export async function getStoredUserByEmail(email: string) { const db = await getSqlDatabase(); const row = first<Row>(db, 'SELECT * FROM users WHERE email = ?', [email]); return row ? toStoredUser(row) : null; }
export async function createStoredUser(input: { username: string; email: string; passwordHash: string }) { const db = await getSqlDatabase(); db.run('INSERT INTO users (username, password_hash, email, created_at) VALUES (?, ?, ?, ?)', [input.username, input.passwordHash, input.email, new Date().toISOString()]); return getStoredUserById(numberValue(first<Row>(db, 'SELECT last_insert_rowid() AS id')?.id)); }
export async function getStoredDocument(id: number) { const db = await getSqlDatabase(); const row = first<Row>(db, `${documentSelect} WHERE d.id = ?`, [id]); return row ? toStoredDocument(row) : null; }
export async function hasDownload(docId: number, userId: number) { const db = await getSqlDatabase(); return Boolean(first<Row>(db, 'SELECT id FROM downloads WHERE doc_id = ? AND user_id = ? LIMIT 1', [docId, userId])); }

export async function redeemDownload(docId: number, userId: number) {
  const db = await getSqlDatabase(); const document = await getStoredDocument(docId); const user = await getStoredUserById(userId);
  if (!document) throw new Error('NOT_FOUND'); if (!document.storageKey) throw new Error('FILE_UNAVAILABLE'); if (!user) throw new Error('UNAUTHORIZED'); if (document.isVip && !user.isVip) throw new Error('VIP_ONLY');
  const starsPaid = user.isVip ? 0 : document.priceStars; if (starsPaid > user.starsBalance) throw new Error('INSUFFICIENT_STARS');
  db.run('BEGIN');
  try { if (starsPaid) db.run('UPDATE users SET stars_balance = stars_balance - ? WHERE id = ?', [starsPaid, userId]); db.run('UPDATE documents SET download_count = download_count + 1 WHERE id = ?', [docId]); db.run('INSERT INTO downloads (doc_id, user_id, stars_paid, downloaded_at) VALUES (?, ?, ?, ?)', [docId, userId, starsPaid, new Date().toISOString()]); db.run('COMMIT'); } catch (error) { db.run('ROLLBACK'); throw error; }
  return { document, starsPaid, newBalance: (await getStoredUserById(userId))!.starsBalance };
}

export async function getDownloadRecords(userId: number) { const db = await getSqlDatabase(); return rows<Row>(db, `SELECT x.*, d.title, d.format, d.file_size FROM downloads x JOIN documents d ON d.id = x.doc_id WHERE x.user_id = ? ORDER BY x.downloaded_at DESC LIMIT 20`, [userId]).map((row) => ({ id: numberValue(row.id), docId: numberValue(row.doc_id), starsPaid: numberValue(row.stars_paid), downloadedAt: stringValue(row.downloaded_at), title: stringValue(row.title), format: stringValue(row.format), fileSize: stringValue(row.file_size) })); }
export async function getAdminUsers() { const db = await getSqlDatabase(); return rows<Row>(db, 'SELECT * FROM users ORDER BY id DESC').map(toStoredUser); }
export async function getAdminDocuments() { const db = await getSqlDatabase(); return rows<Row>(db, `${documentSelect} ORDER BY d.id DESC`).map(toStoredDocument); }
export async function getCategoryByName(name: string) { const db = await getSqlDatabase(); return first<Row>(db, 'SELECT * FROM categories WHERE name = ?', [name]); }

export async function createAdminDocument(input: Omit<StoredDocument, 'id' | 'downloadCount' | 'uploadTime' | 'category'>) { const db = await getSqlDatabase(); db.run('INSERT INTO documents (title, category_id, format, pages, file_size, storage_key, original_name, mime_type, price_stars, upload_time, description, is_vip) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [input.title, input.categoryId, input.format, input.pages, input.fileSize, input.storageKey, input.originalName, input.mimeType, input.priceStars, new Date().toISOString(), input.description, input.isVip ? 1 : 0]); return getStoredDocument(numberValue(first<Row>(db, 'SELECT last_insert_rowid() AS id')?.id)); }
export async function updateAdminDocument(id: number, input: Partial<Omit<StoredDocument, 'id' | 'downloadCount' | 'uploadTime' | 'category'>>) { const db = await getSqlDatabase(); const fields = Object.entries(input).filter(([, value]) => value !== undefined); if (!fields.length) return getStoredDocument(id); const column: Record<string, string> = { categoryId: 'category_id', fileSize: 'file_size', storageKey: 'storage_key', originalName: 'original_name', mimeType: 'mime_type', priceStars: 'price_stars', isVip: 'is_vip' }; db.run(`UPDATE documents SET ${fields.map(([key]) => `${column[key] ?? key} = ?`).join(', ')} WHERE id = ?`, [...fields.map(([key, value]) => key === 'isVip' ? (value ? 1 : 0) : value), id]); return getStoredDocument(id); }
export async function deleteAdminDocument(id: number) { const db = await getSqlDatabase(); const document = await getStoredDocument(id); if (!document) return null; db.run('DELETE FROM documents WHERE id = ?', [id]); return document; }

export async function getAdminOverview() {
  const db = await getSqlDatabase(); const count = (sql: string, params: unknown[] = []) => numberValue(first<Row>(db, sql, params)?.count);
  const today = new Date(); const activity = Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() - (6 - index)); const key = date.toISOString().slice(0, 10); return { date: key, downloads: count('SELECT COUNT(*) AS count FROM downloads WHERE substr(downloaded_at, 1, 10) = ?', [key]) }; });
  return { summary: { documentCount: count('SELECT COUNT(*) AS count FROM documents'), fileCount: count('SELECT COUNT(*) AS count FROM documents WHERE storage_key IS NOT NULL'), userCount: count('SELECT COUNT(*) AS count FROM users'), vipUserCount: count('SELECT COUNT(*) AS count FROM users WHERE is_vip = 1'), downloadCount: count('SELECT COUNT(*) AS count FROM downloads') }, activity, topDocuments: rows<Row>(db, `${documentSelect} ORDER BY d.download_count DESC LIMIT 5`).map((row) => ({ id: numberValue(row.id), title: stringValue(row.title), downloadCount: numberValue(row.download_count), isVip: boolValue(row.is_vip), category: { name: stringValue(row.category_name) } })), categories: rows<Row>(db, 'SELECT c.name, COUNT(d.id) AS documentCount FROM categories c LEFT JOIN documents d ON d.category_id = c.id GROUP BY c.id ORDER BY documentCount DESC LIMIT 5').map((row) => ({ name: stringValue(row.name), documentCount: numberValue(row.documentCount) })) };
}
