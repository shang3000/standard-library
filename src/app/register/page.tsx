'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证密码
    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('register.failed'));
        return;
      }

      // 注册成功，跳转首页（强制刷新以更新 Navbar 状态）
      window.location.href = '/';
    } catch {
      setError(t('register.failedRetry'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9fd] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* 装饰圆形 */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-sky-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-blue-100/50 rounded-full blur-3xl" />

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-8">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">📚</span>
            <h1 className="text-2xl font-bold text-gray-800">{t('register.title')}</h1>
            <p className="text-gray-400 mt-2">{t('register.subtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50/80 backdrop-blur border border-red-200/50 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('register.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder={t('register.usernamePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('register.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder={t('register.emailPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('register.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder={t('register.passwordPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('register.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder={t('register.confirmPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#17324d] hover:bg-[#254c70] text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? t('register.registering') : t('register.button')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {t('register.hasAccount')}{' '}
              <Link href="/login" className="text-sky-700 hover:text-sky-900 font-medium transition-colors duration-200">
                {t('register.loginNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
