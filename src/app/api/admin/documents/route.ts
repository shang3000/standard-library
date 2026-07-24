import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const result = db.exec(`
      SELECT
        d.id, d.title, c.name as category, d.format, d.pages,
        d.file_size, d.price_stars, d.download_count, d.is_vip, d.upload_time
      FROM documents d
      LEFT JOIN categories c ON d.category_id = c.id
      ORDER BY d.id DESC
    `);

    if (result.length === 0) {
      return NextResponse.json({ documents: [] });
    }

    const documents = result[0].values.map((row: unknown[]) => ({
      id: row[0] as number,
      title: row[1] as string,
      category: row[2] as string,
      format: row[3] as string,
      pages: row[4] as number,
      fileSize: row[5] as string,
      priceStars: row[6] as number,
      downloadCount: row[7] as number,
      isVip: Boolean(row[8]),
      uploadTime: row[9] as string,
    }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Fetch documents error:', error);
    return NextResponse.json(
      { error: '获取文档列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, category, format, pages, fileSize, priceStars, description, isVip } =
      await request.json();

    // 验证必填字段
    if (!title) {
      return NextResponse.json(
        { error: '请填写文档标题' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 获取分类 ID
    const catResult = db.exec('SELECT id FROM categories WHERE name = ?', [category]);
    if (catResult.length === 0 || catResult[0].values.length === 0) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 400 }
      );
    }

    const categoryId = catResult[0].values[0][0] as number;

    // 插入文档
    db.run(
      `INSERT INTO documents (title, category_id, format, pages, file_size, price_stars, download_count, upload_time, description, is_vip)
       VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'), ?, ?)`,
      [title, categoryId, format, pages, fileSize, priceStars, description, isVip ? 1 : 0]
    );

    saveDb();

    return NextResponse.json({ success: true, message: '文档添加成功' });
  } catch (error) {
    console.error('Add document error:', error);
    return NextResponse.json(
      { error: '添加文档失败' },
      { status: 500 }
    );
  }
}
