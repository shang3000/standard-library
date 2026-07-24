import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const result = db.exec(`
      SELECT id, username, email, is_vip, stars_balance, created_at
      FROM users
      ORDER BY id DESC
    `);

    if (result.length === 0) {
      return NextResponse.json({ users: [] });
    }

    const users = result[0].values.map((row: unknown[]) => ({
      id: row[0] as number,
      username: row[1] as string,
      email: row[2] as string,
      isVip: Boolean(row[3]),
      starsBalance: row[4] as number,
      createdAt: row[5] as string,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}
