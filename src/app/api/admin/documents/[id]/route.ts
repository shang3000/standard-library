import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteDocumentFile, saveDocumentFile, validateDocumentFile } from '@/lib/document-storage';

export const runtime = 'nodejs';

async function getDocumentId(params: Promise<{ id: string }>) {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });
    const id = await getDocumentId(params);
    if (!id) return NextResponse.json({ error: '文档 ID 无效' }, { status: 400 });
    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: '文档不存在' }, { status: 404 });

    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const category = String(formData.get('category') ?? '');
    const format = String(formData.get('format') ?? '');
    const file = formData.get('file');
    if (!title || !category || !['PDF', 'DOC', 'PPT', 'XLS'].includes(format)) return NextResponse.json({ error: '请填写有效的文档信息' }, { status: 400 });
    const targetCategory = await prisma.category.findUnique({ where: { name: category } });
    if (!targetCategory) return NextResponse.json({ error: '分类不存在' }, { status: 400 });

    const replacement = file instanceof File && file.size > 0 ? file : null;
    if (replacement) validateDocumentFile(replacement, format);
    const stored = replacement ? await saveDocumentFile(replacement) : null;
    const document = await prisma.document.update({
      where: { id },
      data: {
        title,
        categoryId: targetCategory.id,
        format,
        pages: Math.max(0, Number(formData.get('pages')) || 0),
        priceStars: Math.max(0, Number(formData.get('priceStars')) || 0),
        description: String(formData.get('description') ?? '') || null,
        isVip: formData.get('isVip') === 'true',
        ...(stored ? { fileSize: stored.fileSize, storageKey: stored.storageKey, originalName: stored.originalName, mimeType: stored.mimeType } : {}),
      },
    });
    if (stored && existing.storageKey) await deleteDocumentFile(existing.storageKey);
    return NextResponse.json({ success: true, message: '文档已更新', document: { id: document.id, hasFile: Boolean(document.storageKey) } });
  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : '更新文档失败' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });
    const id = await getDocumentId(params);
    if (!id) return NextResponse.json({ error: '文档 ID 无效' }, { status: 400 });
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) return NextResponse.json({ error: '文档不存在' }, { status: 404 });
    await prisma.document.delete({ where: { id } });
    if (document.storageKey) await deleteDocumentFile(document.storageKey);
    return NextResponse.json({ success: true, message: '文档已删除' });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ error: '删除文档失败' }, { status: 500 });
  }
}
