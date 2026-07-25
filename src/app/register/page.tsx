'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
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
      setError('两次输入的密码不一致');
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
        setError(data.error || '注册失败');
        return;
      }

      // 注册成功，跳转首页（强制刷新以更新 Navbar 状态）
      window.location.href = '/';
    } catch {
      setError('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* 装饰圆形 */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-green-200/20 rounded-full blur-3xl" />

      <div className="max-w-md w-full relative z-10 animate-fade-in-up">
        <div className="glass-strong rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">📚</span>
            <h1 className="text-2xl font-bold text-gray-800">注册标准文库</h1>
            <p className="text-gray-400 mt-2">创建账号即可获得 50 星币</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50/80 backdrop-blur border border-red-200/50 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1.5">
                用户名
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
                placeholder="3-20 个字符"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder="至少 6 个字符"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1.5">
                确认密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder="再次输入密码"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-sheen bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              已有账号？{' '}
              <Link href="/login" className="text-primary hover:text-primary-dark font-medium transition-colors duration-200">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}