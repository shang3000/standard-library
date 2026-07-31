import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: '请先登录' }, { status: 401 });
    const { docId } = await request.json();
    const id = Number(docId);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: '文档 ID 无效' }, { status: 400 });

    const result = await prisma.$transaction(async (tx) => {
      const [document, user] = await Promise.all([tx.document.findUnique({ where: { id } }), tx.user.findUnique({ where: { id: currentUser.id } })]);
      if (!document) throw new Error('NOT_FOUND');
      if (!document.storageKey) throw new Error('FILE_UNAVAILABLE');
      if (!user) throw new Error('UNAUTHORIZED');
      if (document.isVip && !user.isVip) throw new Error('VIP_ONLY');
      const starsPaid = user.isVip ? 0 : document.priceStars;
      if (starsPaid > user.starsBalance) throw new Error('INSUFFICIENT_STARS');
      const updatedUser = starsPaid > 0 ? await tx.user.update({ where: { id: user.id }, data: { starsBalance: { decrement: starsPaid } } }) : user;
      await tx.document.update({ where: { id }, data: { downloadCount: { increment: 1 } } });
      await tx.download.create({ data: { docId: id, userId: user.id, starsPaid } });
      return { document, newBalance: updatedUser.starsBalance, starsPaid };
    });
    return NextResponse.json({ success: true, message: '下载成功', download: { docId: result.document.id, title: result.document.title, format: result.document.format, fileSize: result.document.fileSize, starsPaid: result.starsPaid }, newBalance: result.newBalance });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const errors: Record<string, [string, number]> = { NOT_FOUND: ['文档不存在', 404], FILE_UNAVAILABLE: ['该文档暂未上传源文件', 404], UNAUTHORIZED: ['请先登录', 401], VIP_ONLY: ['这是 VIP 专享文档，请先开通 VIP', 403], INSUFFICIENT_STARS: ['星币余额不足', 400] };
    if (errors[message]) return NextResponse.json({ error: errors[message][0] }, { status: errors[message][1] });
    console.error('Download error:', error);
    return NextResponse.json({ error: '下载失败，请重试' }, { status: 500 });
  }
}
