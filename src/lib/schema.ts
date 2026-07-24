import { getDb, saveDb } from './db';

export async function initDB() {
  const db = await getDb();

  // 创建分类表
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT,
      description TEXT
    )
  `);

  // 创建文档表
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      format TEXT NOT NULL CHECK(format IN ('PDF', 'DOC', 'PPT', 'XLS')),
      pages INTEGER DEFAULT 0,
      file_size TEXT,
      price_stars INTEGER DEFAULT 0,
      download_count INTEGER DEFAULT 0,
      upload_time TEXT,
      cover_image TEXT,
      description TEXT,
      is_vip INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // 创建用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT UNIQUE,
      is_vip INTEGER DEFAULT 0,
      stars_balance INTEGER DEFAULT 50,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // 创建下载记录表
  db.run(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doc_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      stars_paid INTEGER DEFAULT 0,
      downloaded_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (doc_id) REFERENCES documents(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 创建索引
  db.run(`CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_documents_format ON documents(format)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_documents_upload_time ON documents(upload_time)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_documents_download_count ON documents(download_count)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_documents_price ON documents(price_stars)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_downloads_doc ON downloads(doc_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);

  saveDb();
  console.log('✅ Database schema initialized');
}
