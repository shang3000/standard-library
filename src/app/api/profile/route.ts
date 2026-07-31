import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });
    const downloads = await prisma.download.findMany({
      where: { userId: user.id },
      include: { document: { select: { title: true, format: true, fileSize: true } } },
      orderBy: { downloadedAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({
      success: true,
      user,
      downloads: downloads.map((item) => ({ id: item.id, docId: item.docId, starsPaid: item.starsPaid, downloadedAt: item.downloadedAt.toISOString(), title: item.document.title, format: item.document.format, fileSize: item.document.fileSize ?? '' })),
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: '获取用户信息失败' }, { status: 500 });
  }
}
