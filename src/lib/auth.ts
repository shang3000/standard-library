import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getStoredUserByEmail, getStoredUserById, getStoredUserByUsername } from './sqljs-repository';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET is not configured.');
const JWT_SECRET = new TextEncoder().encode(jwtSecret);
const COOKIE_NAME = 'auth_token';
const ADMIN_COOKIE_NAME = 'admin_token';

export interface User {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  starsBalance: number;
  createdAt: string;
}

function toUser(user: { id: number; username: string; email: string | null; isVip: boolean; starsBalance: number; createdAt: string }): User {
  return { id: user.id, username: user.username, email: user.email ?? '', isVip: user.isVip, starsBalance: user.starsBalance, createdAt: user.createdAt };
}

export async function createToken(userId: number) {
  return new SignJWT({ userId }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(JWT_SECRET);
}

export async function createAdminToken() {
  return new SignJWT({ admin: true }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('8h').sign(JWT_SECRET);
}

async function verifyToken(token: string) {
  try { return (await jwtVerify(token, JWT_SECRET)).payload; } catch { return null; }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || typeof payload.userId !== 'number') return null;
  const user = await getStoredUserById(payload.userId);
  return user ? toUser(user) : null;
}

export async function isAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return (await verifyToken(token))?.admin === true;
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' });
  return response;
}

export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 8 * 60 * 60, path: '/' });
  return response;
}

export function clearAuthCookie(response: NextResponse) { response.cookies.delete(COOKIE_NAME); return response; }

export async function findUserByUsername(username: string) {
  return getStoredUserByUsername(username);
}

export async function findUserByEmail(email: string) {
  return getStoredUserByEmail(email);
}
