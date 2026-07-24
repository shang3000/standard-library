import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docId = Number(id);

    if (!docId) {
      return NextResponse.json(
        { error: '文档 ID 无效' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 检查文档是否存在
    const docResult = db.exec('SELECT id FROM documents WHERE id = ?', [docId]);
    if (docResult.length === 0 || docResult[0].values.length === 0) {
      return NextResponse.json(
        { error: '文档不存在' },
        { status: 404 }
      );
    }

    // 删除相关的下载记录
    db.run('DELETE FROM downloads WHERE doc_id = ?', [docId]);

    // 删除文档
    db.run('DELETE FROM documents WHERE id = ?', [docId]);

    saveDb();

    return NextResponse.json({ success: true, message: '文档已删除' });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: '删除文档失败' },
      { status: 500 }
    );
  }
}
