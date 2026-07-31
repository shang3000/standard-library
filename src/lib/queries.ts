import { prisma } from './prisma';
import { Category, Document, DocFormat } from '@/types';

type DocumentWithCategory = Awaited<ReturnType<typeof prisma.document.findFirst>> & {
  category: { name: string; slug: string };
};

function mapDocument(document: NonNullable<DocumentWithCategory>): Document {
  return {
    id: String(document.id),
    title: document.title,
    category: document.category.name,
    categorySlug: document.category.slug,
    categoryId: String(document.categoryId),
    format: document.format as DocFormat,
    price: document.priceStars,
    isVip: document.isVip,
    pages: document.pages,
    size: document.fileSize ?? '',
    uploadDate: document.uploadTime.toISOString().slice(0, 10),
    downloadCount: document.downloadCount,
    description: document.description ?? '',
    coverImage: document.coverImage ?? undefined,
  };
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { documents: true } } },
    orderBy: { id: 'asc' },
  });

  return categories.map((category) => ({
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    icon: category.icon ?? '',
    description: category.description ?? '',
    count: category._count.documents,
  }));
}

export async function getLatestDocuments(limit = 8, offset = 0): Promise<Document[]> {
  const documents = await prisma.document.findMany({
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { uploadTime: 'desc' },
    take: limit,
    skip: offset,
  });
  return documents.map(mapDocument);
}

export async function getDocumentsByCategory(
  slug: string,
  limit = 20,
  offset = 0,
  filters?: { formats?: DocFormat[]; isFree?: boolean; isVip?: boolean; sort?: string }
): Promise<{ documents: Document[]; total: number }> {
  const where = {
    category: { slug },
    ...(filters?.formats?.length ? { format: { in: filters.formats } } : {}),
    ...(filters?.isFree ? { priceStars: 0 } : {}),
    ...(filters?.isVip ? { isVip: true } : {}),
  };
  const orderBy = filters?.sort === 'downloads'
    ? { downloadCount: 'desc' as const }
    : filters?.sort === 'price_asc'
      ? { priceStars: 'asc' as const }
      : filters?.sort === 'price_desc'
        ? { priceStars: 'desc' as const }
        : { uploadTime: 'desc' as const };
  const [documents, total] = await prisma.$transaction([
    prisma.document.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy,
      take: limit,
      skip: offset,
    }),
    prisma.document.count({ where }),
  ]);
  return { documents: documents.map(mapDocument), total };
}

export async function getDocumentById(id: string): Promise<Document | undefined> {
  const document = await prisma.document.findUnique({
    where: { id: Number(id) },
    include: { category: { select: { name: true, slug: true } } },
  });
  return document ? mapDocument(document) : undefined;
}

export async function getRelatedDocuments(categoryId: number, excludeId: string, limit = 4): Promise<Document[]> {
  const documents = await prisma.document.findMany({
    where: { categoryId, id: { not: Number(excludeId) } },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { downloadCount: 'desc' },
    take: limit,
  });
  return documents.map(mapDocument);
}

export async function searchDocuments(keyword: string, limit = 20, offset = 0): Promise<{ documents: Document[]; total: number }> {
  const where = {
    OR: [
      { title: { contains: keyword } },
      { description: { contains: keyword } },
      { category: { name: { contains: keyword } } },
    ],
  };
  const [documents, total] = await prisma.$transaction([
    prisma.document.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { downloadCount: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.document.count({ where }),
  ]);
  return { documents: documents.map(mapDocument), total };
}

export async function incrementDownloadCount(id: string): Promise<void> {
  await prisma.document.update({ where: { id: Number(id) }, data: { downloadCount: { increment: 1 } } });
}

export async function getPopularDocuments(limit = 10): Promise<Document[]> {
  const documents = await prisma.document.findMany({
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { downloadCount: 'desc' },
    take: limit,
  });
  return documents.map(mapDocument);
}

export async function getDocumentStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const [totalDocs, totalCategories, totalUsers, downloadAggregate, todayNewDocs, todayUpdates] = await prisma.$transaction([
    prisma.document.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.document.aggregate({ _sum: { downloadCount: true } }),
    prisma.document.count({ where: { uploadTime: { gte: startOfToday } } }),
    prisma.document.count({ where: { downloadCount: { gt: 0 } } }),
  ]);
  return {
    totalDocs,
    totalCategories,
    totalUsers,
    totalDownloads: downloadAggregate._sum.downloadCount ?? 0,
    todayNewDocs,
    todayUpdates,
  };
}
