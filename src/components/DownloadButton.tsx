'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DownloadButtonProps {
  docId: string;
  price: number;
  isVip: boolean;
}

export default function DownloadButton({ docId, price, isVip }: DownloadButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<{ isVip: boolean; starsBalance: number } | null>(null);

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
    }
  };

  const handleDownload = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '下载失败');
        return;
      }

      setSuccess(data.message || '下载成功');
      // 刷新页面更新下载次数
      router.refresh();
    } catch {
      setError('下载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 判断按钮状态
  const isDisabled = isVip && !user?.isVip;
  const needsStars = price > 0 && !isVip && user && !user.isVip;
  const insufficientStars = needsStars && user && user.starsBalance < price;

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={loading || isDisabled || !!insufficientStars}
        className={`w-full md:w-auto px-8 py-3 font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
          isDisabled
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : insufficientStars
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'btn-sheen bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white'
        }`}
      >
        {loading ? '下载中...' : isDisabled ? 'VIP 专享' : insufficientStars ? '星币不足' : '立即下载'}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}

      {success && (
        <p className="mt-2 text-sm text-emerald-500">{success}</p>
      )}

      {isVip && !user?.isVip && (
        <p className="mt-2 text-sm text-yellow-500">
          这是 VIP 专享文档，开通 VIP 即可免费下载
        </p>
      )}

      {needsStars && user && !insufficientStars && (
        <p className="mt-2 text-sm text-gray-400">
          下载将扣除 {price} 星币，当前余额 {user.starsBalance} 星币
        </p>
      )}
    </div>
  );
}