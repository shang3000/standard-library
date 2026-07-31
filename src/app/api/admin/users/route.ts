import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });
    const users = await prisma.user.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json({ users: users.map((user) => ({ id: user.id, username: user.username, email: user.email ?? '', isVip: user.isVip, starsBalance: user.starsBalance, createdAt: user.createdAt.toISOString() })) });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 });
  }
}
