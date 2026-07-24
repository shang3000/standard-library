import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    // 检查登录状态
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const db = await getDb();

    // 获取下载历史（最近 20 条）
    const downloadsResult = db.exec(
      `SELECT d.id, d.doc_id, d.stars_paid, d.downloaded_at,
              doc.title, doc.format, doc.file_size
       FROM downloads d
       JOIN documents doc ON d.doc_id = doc.id
       WHERE d.user_id = ?
       ORDER BY d.downloaded_at DESC
       LIMIT 20`,
      [user.id]
    );

    const downloads = downloadsResult.length > 0
      ? downloadsResult[0].values.map((row: unknown[]) => ({
          id: row[0] as number,
          docId: row[1] as number,
          starsPaid: row[2] as number,
          downloadedAt: row[3] as string,
          title: row[4] as string,
          format: row[5] as string,
          fileSize: row[6] as string,
        }))
      : [];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVip: user.isVip,
        starsBalance: user.starsBalance,
        createdAt: user.createdAt,
      },
      downloads,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}