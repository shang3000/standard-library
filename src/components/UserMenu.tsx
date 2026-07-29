'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

interface User {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  starsBalance: number;
}

export default function UserMenu() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch {
      // 未登录
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setShowMenu(false);
      // 强制刷新以更新 Navbar 状态
      window.location.href = '/';
    } catch {
      // ignore
    }
  };

  if (loading) {
    return <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-3">
        <Link
          href="/login"
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium text-sm"
        >
          {t('user.login')}
        </Link>
        <Link
          href="/register"
          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full transition-all duration-200 text-sm shadow-sm"
        >
          {t('user.register')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* 我的文档按钮 */}
      <Link
        href="/profile"
        className="hidden sm:flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-full transition-all duration-200 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {t('user.myDocs')}
      </Link>

      {/* 用户菜单 */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none"
        >
          {user.isVip && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-medium shadow-sm">
              VIP
            </span>
          )}
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm font-medium text-gray-600">{user.starsBalance}</span>
          </div>
          <span className="text-sm font-medium text-gray-600">{user.username}</span>
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
            <Link
              href="/profile"
              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
              onClick={() => setShowMenu(false)}
            >
              {t('user.profile')}
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
            >
              {t('user.logout')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
