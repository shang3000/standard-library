import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'bjxwk.db');

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  // 初始化 sql.js，指定 WASM 文件路径
  const SQL = await initSqlJs({
    locateFile: (file) => {
      // 从 node_modules 中找到 sql.js 的 WASM 文件
      return path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file);
    },
  });

  // 确保 data 目录存在
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 如果数据库文件存在，读取它
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  return db;
}

export function saveDb() {
  if (!db) return;

  const data = db.export();
  const buffer = Buffer.from(data);

  // 确保 data 目录存在
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(DB_PATH, buffer);
}

export { DB_PATH };
