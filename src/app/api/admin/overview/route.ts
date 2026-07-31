import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [documentCount, fileCount, userCount, vipUserCount, downloadCount, recentDownloads, topDocuments, categories] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({ where: { storageKey: { not: null } } }),
      prisma.user.count(),
      prisma.user.count({ where: { isVip: true } }),
      prisma.download.count(),
      prisma.download.findMany({ where: { downloadedAt: { gte: sevenDaysAgo } }, select: { downloadedAt: true } }),
      prisma.document.findMany({ take: 5, orderBy: { downloadCount: 'desc' }, select: { id: true, title: true, downloadCount: true, isVip: true, category: { select: { name: true } } } }),
      prisma.category.findMany({ select: { name: true, _count: { select: { documents: true } } }, orderBy: { documents: { _count: 'desc' } }, take: 5 }),
    ]);

    const dayMap = new Map<string, number>();
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      dayMap.set(dayKey(date), 0);
    }
    recentDownloads.forEach(({ downloadedAt }) => {
      const key = dayKey(downloadedAt);
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    });

    return NextResponse.json({
      summary: { documentCount, fileCount, userCount, vipUserCount, downloadCount },
      activity: Array.from(dayMap, ([date, downloads]) => ({ date, downloads })),
      topDocuments,
      categories: categories.map((category) => ({ name: category.name, documentCount: category._count.documents })),
    });
  } catch (error) {
    console.error('Fetch admin overview error:', error);
    return NextResponse.json({ error: '获取管理概览失败' }, { status: 500 });
  }
}
