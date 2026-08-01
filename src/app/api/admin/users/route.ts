import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getAdminUsers } from '@/lib/sqljs-repository';

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });
    const users = await getAdminUsers();
    return NextResponse.json({ users: users.map(({ passwordHash: _passwordHash, ...user }) => user) });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 });
  }
}
