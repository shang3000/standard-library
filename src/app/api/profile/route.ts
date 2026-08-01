import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDownloadRecords } from '@/lib/sqljs-repository';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });
    const downloads = await getDownloadRecords(user.id);
    return NextResponse.json({
      success: true,
      user,
      downloads,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: '获取用户信息失败' }, { status: 500 });
  }
}
