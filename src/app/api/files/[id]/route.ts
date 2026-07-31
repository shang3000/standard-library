import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { readDocumentFile } from '@/lib/document-storage';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: '文档 ID 无效' }, { status: 400 });
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document?.storageKey || !document.originalName) return NextResponse.json({ error: '该文档暂未上传源文件' }, { status: 404 });
    if (document.isVip && !user.isVip) return NextResponse.json({ error: '这是 VIP 专享文档' }, { status: 403 });
    if (document.priceStars > 0 && !user.isVip) {
      const purchased = await prisma.download.findFirst({ where: { docId: id, userId: user.id } });
      if (!purchased) return NextResponse.json({ error: '请先完成下载兑换' }, { status: 403 });
    }
    const bytes = await readDocumentFile(document.storageKey);
    return new NextResponse(new Uint8Array(bytes), { headers: { 'Content-Type': document.mimeType ?? 'application/octet-stream', 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(document.originalName)}`, 'Content-Length': String(bytes.length), 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    console.error('Serve document file error:', error);
    return NextResponse.json({ error: '读取文件失败' }, { status: 500 });
  }
}
