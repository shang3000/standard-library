import { getDb } from './db';
import { Category, Document, DocFormat } from '@/types';

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  const result = db.exec(`
    SELECT c.*, COUNT(d.id) as doc_count
    FROM categories c
    LEFT JOIN documents d ON c.id = d.category_id
    GROUP BY c.id
    ORDER BY c.id
  `);

  if (result.length === 0) return [];

  return result[0].values.map((row) => ({
    id: String(row[0]),
    name: row[1] as string,
    slug: row[2] as string,
    icon: row[3] as string,
    description: row[4] as string,
    count: row[5] as number,
  }));
}

// 获取最新文档
export async function getLatestDocuments(limit: number = 8, offset: number = 0): Promise<Document[]> {
  const db = await getDb();
  const result = db.exec(
    `SELECT d.*, c.name as category_name, c.slug as category_slug
     FROM documents d
     JOIN categories c ON d.category_id = c.id
     ORDER BY d.upload_time DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  if (result.length === 0) return [];

  return result[0].values.map(mapRowToDocument);
}

// 根据分类获取文档
export async function getDocumentsByCategory(
  slug: string,
  limit: number = 20,
  offset: number = 0,
  filters?: {
    formats?: DocFormat[];
    isFree?: boolean;
    isVip?: boolean;
    sort?: string;
  }
): Promise<{ documents: Document[]; total: number }> {
  const db = await getDb();

  let whereClause = 'WHERE c.slug = ?';
  const params: any[] = [slug];

  // 格式筛选
  if (filters?.formats && filters.formats.length > 0) {
    const placeholders = filters.formats.map(() => '?').join(',');
    whereClause += ` AND d.format IN (${placeholders})`;
    params.push(...filters.formats);
  }

  // 免费筛选
  if (filters?.isFree) {
    whereClause += ' AND d.price_stars = 0';
  }

  // VIP 筛选
  if (filters?.isVip) {
    whereClause += ' AND d.is_vip = 1';
  }

  // 获取总数
  const countResult = db.exec(
    `SELECT COUNT(*) FROM documents d JOIN categories c ON d.category_id = c.id ${whereClause}`,
    params
  );
  const total = countResult[0]?.values[0]?.[0] as number || 0;

  // 排序
  let orderClause = 'ORDER BY d.upload_time DESC';
  switch (filters?.sort) {
    case 'downloads':
      orderClause = 'ORDER BY d.download_count DESC';
      break;
    case 'price_asc':
      orderClause = 'ORDER BY d.price_stars ASC';
      break;
    case 'price_desc':
      orderClause = 'ORDER BY d.price_stars DESC';
      break;
  }

  // 获取文档
  const result = db.exec(
    `SELECT d.*, c.name as category_name, c.slug as category_slug
     FROM documents d
     JOIN categories c ON d.category_id = c.id
     ${whereClause}
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const documents = result.length === 0 ? [] : result[0].values.map(mapRowToDocument);

  return { documents, total };
}

// 根据 ID 获取文档
export async function getDocumentById(id: string): Promise<Document | undefined> {
  const db = await getDb();
  const result = db.exec(
    `SELECT d.*, c.name as category_name, c.slug as category_slug
     FROM documents d
     JOIN categories c ON d.category_id = c.id
     WHERE d.id = ?`,
    [Number(id)]
  );

  if (result.length === 0 || result[0].values.length === 0) return undefined;

  return mapRowToDocument(result[0].values[0]);
}

// 获取相关推荐
export async function getRelatedDocuments(
  categoryId: number,
  excludeId: string,
  limit: number = 4
): Promise<Document[]> {
  const db = await getDb();
  const result = db.exec(
    `SELECT d.*, c.name as category_name, c.slug as category_slug
     FROM documents d
     JOIN categories c ON d.category_id = c.id
     WHERE d.category_id = ? AND d.id != ?
     ORDER BY d.download_count DESC
     LIMIT ?`,
    [categoryId, Number(excludeId), limit]
  );

  if (result.length === 0) return [];

  return result[0].values.map(mapRowToDocument);
}

// 搜索文档
export async function searchDocuments(
  keyword: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ documents: Document[]; total: number }> {
  const db = await getDb();
  const searchPattern = `%${keyword}%`;

  // 获取总数
  const countResult = db.exec(
    `SELECT COUNT(*) FROM documents d
     JOIN categories c ON d.category_id = c.id
     WHERE d.title LIKE ? OR d.description LIKE ? OR c.name LIKE ?`,
    [searchPattern, searchPattern, searchPattern]
  );
  const total = countResult[0]?.values[0]?.[0] as number || 0;

  // 获取文档
  const result = db.exec(
    `SELECT d.*, c.name as category_name, c.slug as category_slug
     FROM documents d
     JOIN categories c ON d.category_id = c.id
     WHERE d.title LIKE ? OR d.description LIKE ? OR c.name LIKE ?
     ORDER BY d.download_count DESC
     LIMIT ? OFFSET ?`,
    [searchPattern, searchPattern, searchPattern, limit, offset]
  );

  const documents = result.length === 0 ? [] : result[0].values.map(mapRowToDocument);

  return { documents, total };
}

// 增加下载次数
export async function incrementDownloadCount(id: string): Promise<void> {
  const db = await getDb();
  db.run('UPDATE documents SET download_count = download_count + 1 WHERE id = ?', [Number(id)]);
}

// 获取热门文档
export async function getPopularDocuments(limit: number = 10): Promise<Document[]> {
  const db = await getDb();
  const result = db.exec(
    `SELECT d.*, c.name as category_name, c.slug as category_slug
     FROM documents d
     JOIN categories c ON d.category_id = c.id
     ORDER BY d.download_count DESC
     LIMIT ?`,
    [limit]
  );

  if (result.length === 0) return [];

  return result[0].values.map(mapRowToDocument);
}

// 辅助函数：将数据库行映射为 Document 对象
function mapRowToDocument(row: any[]): Document {
  return {
    id: String(row[0]),
    title: row[1] as string,
    category: row[11] as string, // category_name
    categorySlug: row[12] as string, // category_slug
    format: row[3] as DocFormat,
    price: row[6] as number,
    isVip: Boolean(row[10]),
    pages: row[4] as number,
    size: row[5] as string,
    uploadDate: row[7] as string,
    downloadCount: row[8] as number,
    description: row[9] as string,
  };
}
