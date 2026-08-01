import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { saveDocumentFile, validateDocumentFile } from '@/lib/document-storage';
import { createAdminDocument, getAdminDocuments, getCategoryByName } from '@/lib/sqljs-repository';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });
    const documents = await getAdminDocuments();
    return NextResponse.json({ documents: documents.map((doc) => ({ ...doc, hasFile: Boolean(doc.storageKey) })) });
  } catch (error) {
    console.error('Fetch documents error:', error);
    return NextResponse.json({ error: '获取文档列表失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });
    if (process.env.VERCEL) return NextResponse.json({ error: '线上演示模式不保存上传文件，请在本地或接入对象存储后使用。' }, { status: 409 });
    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();
    const category = String(formData.get('category') ?? '');
    const format = String(formData.get('format') ?? '');
    const file = formData.get('file');
    if (!title || !category || !['PDF', 'DOC', 'PPT', 'XLS'].includes(format)) return NextResponse.json({ error: '请填写有效的文档信息' }, { status: 400 });
    if (!(file instanceof File)) return NextResponse.json({ error: '请选择要上传的文档文件' }, { status: 400 });
    validateDocumentFile(file, format);
    const targetCategory = await getCategoryByName(category);
    if (!targetCategory) return NextResponse.json({ error: '分类不存在' }, { status: 400 });
    const stored = await saveDocumentFile(file);
    await createAdminDocument({ title, categoryId: Number(targetCategory.id), format: format as 'PDF' | 'DOC' | 'PPT' | 'XLS', pages: Math.max(0, Number(formData.get('pages')) || 0), fileSize: stored.fileSize, storageKey: stored.storageKey, originalName: stored.originalName, mimeType: stored.mimeType, priceStars: Math.max(0, Number(formData.get('priceStars')) || 0), description: String(formData.get('description') ?? ''), isVip: formData.get('isVip') === 'true' });
    return NextResponse.json({ success: true, message: '文档上传成功' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '上传文档失败';
    console.error('Upload document error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
