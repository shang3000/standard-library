'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('login.failed'));
        return;
      }

      // 登录成功，跳转首页（强制刷新以更新 Navbar 状态）
      window.location.href = '/';
    } catch {
      setError(t('login.failedRetry'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* 装饰圆形 */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-green-200/20 rounded-full blur-3xl" />

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="glass-strong rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">📚</span>
            <h1 className="text-2xl font-bold text-gray-800">{t('login.title')}</h1>
            <p className="text-gray-400 mt-2">{t('login.welcome')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50/80 backdrop-blur border border-red-200/50 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('login.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder={t('login.usernamePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('login.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder={t('login.passwordPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-sheen bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('login.logging') : t('login.button')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {t('login.noAccount')}{' '}
              <Link href="/register" className="text-primary hover:text-primary-dark font-medium transition-colors duration-200">
                {t('login.registerNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
