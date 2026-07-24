import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb, saveDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 检查登录状态
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { docId } = await request.json();
    if (!docId) {
      return NextResponse.json(
        { error: '文档 ID 无效' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 获取文档信息
    const docResult = db.exec(
      'SELECT id, title, format, price_stars, is_vip, file_size FROM documents WHERE id = ?',
      [Number(docId)]
    );

    if (docResult.length === 0 || docResult[0].values.length === 0) {
      return NextResponse.json(
        { error: '文档不存在' },
        { status: 404 }
      );
    }

    const doc = docResult[0].values[0];
    const docIdNum = doc[0] as number;
    const docTitle = doc[1] as string;
    const docFormat = doc[2] as string;
    const priceStars = doc[3] as number;
    const isVip = Boolean(doc[4]);
    const fileSize = doc[5] as string;

    // VIP 文档检查
    if (isVip && !user.isVip) {
      return NextResponse.json(
        { error: '这是 VIP 专享文档，请先开通 VIP' },
        { status: 403 }
      );
    }

    // 付费文档检查星币
    if (priceStars > 0 && !isVip) {
      // VIP 用户免费下载付费文档
      if (!user.isVip) {
        // 检查星币余额
        if (user.starsBalance < priceStars) {
          return NextResponse.json(
            { error: `星币余额不足，需要 ${priceStars} 星币，当前余额 ${user.starsBalance} 星币` },
            { status: 400 }
          );
        }

        // 扣除星币
        db.run(
          'UPDATE users SET stars_balance = stars_balance - ? WHERE id = ?',
          [priceStars, user.id]
        );
      }
    }

    // 增加下载次数
    db.run(
      'UPDATE documents SET download_count = download_count + 1 WHERE id = ?',
      [docIdNum]
    );

    // 记录下载
    db.run(
      'INSERT INTO downloads (doc_id, user_id, stars_paid) VALUES (?, ?, ?)',
      [docIdNum, user.id, user.isVip ? 0 : priceStars]
    );

    saveDb();

    // 获取更新后的用户余额
    const userResult = db.exec(
      'SELECT stars_balance FROM users WHERE id = ?',
      [user.id]
    );
    const newBalance = userResult[0]?.values[0]?.[0] as number || 0;

    return NextResponse.json({
      success: true,
      message: '下载成功',
      download: {
        docId: docIdNum,
        title: docTitle,
        format: docFormat,
        fileSize: fileSize,
        starsPaid: user.isVip ? 0 : priceStars,
      },
      newBalance,
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: '下载失败，请重试' },
      { status: 500 }
    );
  }
}