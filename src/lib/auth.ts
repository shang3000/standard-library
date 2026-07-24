import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDb } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'standard-library-secret-key-2024'
);

const COOKIE_NAME = 'auth_token';

export interface User {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  starsBalance: number;
  createdAt: string;
}

// 创建 JWT token
export async function createToken(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// 验证 JWT token
export async function verifyToken(token: string): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as number };
  } catch {
    return null;
  }
}

// 获取当前登录用户
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const db = await getDb();
  const result = db.exec(
    'SELECT id, username, email, is_vip, stars_balance, created_at FROM users WHERE id = ?',
    [payload.userId]
  );

  if (result.length === 0 || result[0].values.length === 0) return null;

  const row = result[0].values[0];
  return {
    id: row[0] as number,
    username: row[1] as string,
    email: row[2] as string,
    isVip: Boolean(row[3]),
    starsBalance: row[4] as number,
    createdAt: row[5] as string,
  };
}

// 设置认证 cookie (在 Route Handler 中使用)
export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
  return response;
}

// 清除认证 cookie (在 Route Handler 中使用)
export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete(COOKIE_NAME);
  return response;
}

// 根据用户名查找用户
export async function findUserByUsername(username: string) {
  const db = await getDb();
  const result = db.exec(
    'SELECT id, username, email, password_hash, is_vip, stars_balance, created_at FROM users WHERE username = ?',
    [username]
  );

  if (result.length === 0 || result[0].values.length === 0) return null;

  const row = result[0].values[0];
  return {
    id: row[0] as number,
    username: row[1] as string,
    email: row[2] as string,
    passwordHash: row[3] as string,
    isVip: Boolean(row[4]),
    starsBalance: row[5] as number,
    createdAt: row[6] as string,
  };
}

// 根据邮箱查找用户
export async function findUserByEmail(email: string) {
  const db = await getDb();
  const result = db.exec(
    'SELECT id, username, email, password_hash, is_vip, stars_balance, created_at FROM users WHERE email = ?',
    [email]
  );

  if (result.length === 0 || result[0].values.length === 0) return null;

  const row = result[0].values[0];
  return {
    id: row[0] as number,
    username: row[1] as string,
    email: row[2] as string,
    passwordHash: row[3] as string,
    isVip: Boolean(row[4]),
    starsBalance: row[5] as number,
    createdAt: row[6] as string,
  };
}