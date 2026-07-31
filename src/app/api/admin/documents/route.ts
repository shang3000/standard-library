import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveDocumentFile, validateDocumentFile } from '@/lib/document-storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });
    const documents = await prisma.document.findMany({ include: { category: { select: { name: true } } }, orderBy: { id: 'desc' } });
    return NextResponse.json({ documents: documents.map((doc) => ({ id: doc.id, title: doc.title, category: doc.category.name, format: doc.format, pages: doc.pages, fileSize: doc.fileSize ?? '', priceStars: doc.priceStars, downloadCount: doc.downloadCount, isVip: doc.isVip, description: doc.description ?? '', uploadTime: doc.uploadTime.toISOString(), hasFile: Boolean(doc.storageKey) })) });
  } catch (error) {
    console.error('Fetch documents error:', error);
    return NextResponse.json({ error: '获取文档列表失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });
    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const category = String(formData.get('category') ?? '');
    const format = String(formData.get('format') ?? '');
    const file = formData.get('file');
    if (!title || !category || !['PDF', 'DOC', 'PPT', 'XLS'].includes(format)) return NextResponse.json({ error: '请填写有效的文档信息' }, { status: 400 });
    if (!(file instanceof File)) return NextResponse.json({ error: '请选择要上传的文档文件' }, { status: 400 });
    validateDocumentFile(file, format);
    const targetCategory = await prisma.category.findUnique({ where: { name: category } });
    if (!targetCategory) return NextResponse.json({ error: '分类不存在' }, { status: 400 });
    const stored = await saveDocumentFile(file);
    await prisma.document.create({ data: { title, categoryId: targetCategory.id, format, pages: Math.max(0, Number(formData.get('pages')) || 0), fileSize: stored.fileSize, storageKey: stored.storageKey, originalName: stored.originalName, mimeType: stored.mimeType, priceStars: Math.max(0, Number(formData.get('priceStars')) || 0), description: String(formData.get('description') ?? '') || null, isVip: formData.get('isVip') === 'true' } });
    return NextResponse.json({ success: true, message: '文档上传成功' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '上传文档失败';
    console.error('Upload document error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
