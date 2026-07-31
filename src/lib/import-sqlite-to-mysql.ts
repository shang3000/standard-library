import { getDb } from './db';
import { prisma } from './prisma-client';

type SqlRow = Record<string, unknown>;

async function queryRows(sql: string): Promise<SqlRow[]> {
  return getDb().then((db) => {
    const result = db.exec(sql)[0];
    if (!result) return [];

    return result.values.map((values) =>
      Object.fromEntries(result.columns.map((column, index) => [column, values[index]]))
    );
  });
}

function toDate(value: unknown): Date {
  const text = String(value);
  const normalized = text.includes('T')
    ? text
    : `${text.replace(' ', 'T')}${text.length === 10 ? 'T00:00:00' : ''}`;
  return new Date(`${normalized.endsWith('Z') ? normalized : `${normalized}Z`}`);
}

async function importData() {
  const [categories, documents, users, downloads] = await Promise.all([
    queryRows('SELECT id, name, slug, icon, description FROM categories ORDER BY id'),
    queryRows(`SELECT id, title, category_id, format, pages, file_size, price_stars,
      download_count, upload_time, cover_image, description, is_vip FROM documents ORDER BY id`),
    queryRows(`SELECT id, username, password_hash, email, is_vip, stars_balance,
      created_at FROM users ORDER BY id`),
    queryRows('SELECT id, doc_id, user_id, stars_paid, downloaded_at FROM downloads ORDER BY id'),
  ]);

  for (const row of categories) {
    await prisma.category.upsert({
      where: { id: Number(row.id) },
      create: {
        id: Number(row.id),
        name: String(row.name),
        slug: String(row.slug),
        icon: row.icon ? String(row.icon) : null,
        description: row.description ? String(row.description) : null,
      },
      update: {
        name: String(row.name),
        slug: String(row.slug),
        icon: row.icon ? String(row.icon) : null,
        description: row.description ? String(row.description) : null,
      },
    });
  }

  for (const row of users) {
    await prisma.user.upsert({
      where: { id: Number(row.id) },
      create: {
        id: Number(row.id),
        username: String(row.username),
        passwordHash: String(row.password_hash),
        email: row.email ? String(row.email) : null,
        isVip: Boolean(row.is_vip),
        starsBalance: Number(row.stars_balance),
        createdAt: toDate(row.created_at),
      },
      update: {
        username: String(row.username),
        passwordHash: String(row.password_hash),
        email: row.email ? String(row.email) : null,
        isVip: Boolean(row.is_vip),
        starsBalance: Number(row.stars_balance),
        createdAt: toDate(row.created_at),
      },
    });
  }

  for (const row of documents) {
    const data = {
      title: String(row.title),
      categoryId: Number(row.category_id),
      format: String(row.format),
      pages: Number(row.pages),
      fileSize: row.file_size ? String(row.file_size) : null,
      priceStars: Number(row.price_stars),
      downloadCount: Number(row.download_count),
      uploadTime: toDate(row.upload_time),
      coverImage: row.cover_image ? String(row.cover_image) : null,
      description: row.description ? String(row.description) : null,
      isVip: Boolean(row.is_vip),
    };

    await prisma.document.upsert({
      where: { id: Number(row.id) },
      create: { id: Number(row.id), ...data },
      update: data,
    });
  }

  for (const row of downloads) {
    const data = {
      docId: Number(row.doc_id),
      userId: Number(row.user_id),
      starsPaid: Number(row.stars_paid),
      downloadedAt: toDate(row.downloaded_at),
    };

    await prisma.download.upsert({
      where: { id: Number(row.id) },
      create: { id: Number(row.id), ...data },
      update: data,
    });
  }

  console.log(`Imported ${categories.length} categories, ${documents.length} documents, ${users.length} users, and ${downloads.length} downloads.`);
}

importData()
  .catch((error) => {
    console.error('MySQL import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
