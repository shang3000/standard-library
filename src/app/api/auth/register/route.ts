import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { findUserByEmail, findUserByUsername, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) return NextResponse.json({ error: '请填写所有必填字段' }, { status: 400 });
    if (username.length < 3 || username.length > 20) return NextResponse.json({ error: '用户名长度应为 3-20 个字符' }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: '密码长度至少 6 个字符' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 });
    if (await findUserByUsername(username)) return NextResponse.json({ error: '用户名已被占用' }, { status: 400 });
    if (await findUserByEmail(email)) return NextResponse.json({ error: '邮箱已被注册' }, { status: 400 });

    const user = await prisma.user.create({
      data: { username, email, passwordHash: await bcrypt.hash(password, 10), starsBalance: 50 },
    });
    const response = NextResponse.json({ success: true, user: { id: user.id, username: user.username, email: user.email, isVip: user.isVip, starsBalance: user.starsBalance } });
    return setAuthCookie(response, await createToken(user.id));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: '用户名或邮箱已被注册' }, { status: 400 });
    console.error('Register error:', error);
    return NextResponse.json({ error: '注册失败，请重试' }, { status: 500 });
  }
}
