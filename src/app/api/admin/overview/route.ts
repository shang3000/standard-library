import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getAdminOverview } from '@/lib/sqljs-repository';

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: '未授权' }, { status: 401 });

    return NextResponse.json(await getAdminOverview());
  } catch (error) {
    console.error('Fetch admin overview error:', error);
    return NextResponse.json({ error: '获取管理概览失败' }, { status: 500 });
  }
}
