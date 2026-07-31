import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, setAdminCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminPassword && password === adminPassword) {
      const response = NextResponse.json({ success: true });
      return setAdminCookie(response, await createAdminToken());
    }

    return NextResponse.json(
      { error: '密码错误' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500 }
    );
  }
}
