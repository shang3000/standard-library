'use client';

import Link from 'next/link';
import { Document } from '@/types';
import { useTranslation } from '@/lib/i18n';

interface DocumentCardProps {
  doc: Document;
}

export default function DocumentCard({ doc }: DocumentCardProps) {
  const { t } = useTranslation();

  // 格式标签颜色
  const formatTagColors: Record<string, string> = {
    PDF: 'bg-red-50 text-red-500 border border-red-200',
    DOC: 'bg-blue-50 text-blue-500 border border-blue-200',
    PPT: 'bg-orange-50 text-orange-500 border border-orange-200',
    XLS: 'bg-emerald-50 text-emerald-500 border border-emerald-200',
  };

  // 格式图标样式（大图标，居中）
  const formatIcons: Record<string, { bg: string; icon: React.ReactNode }> = {
    PDF: {
      bg: 'bg-gradient-to-br from-red-400 via-rose-500 to-red-600',
      icon: (
        <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    DOC: {
      bg: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-600',
      icon: (
        <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    PPT: {
      bg: 'bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600',
      icon: (
        <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
    },
    XLS: {
      bg: 'bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600',
      icon: (
        <svg className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  };

  const formatStyle = formatIcons[doc.format] || formatIcons.PDF;

  return (
    <Link href={`/doc/${doc.id}`} className="group block">
      <div className="bg-white rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100 shadow-sm">
        {/* 图标区域 - 浅粉色背景 */}
        <div className="w-full h-52 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
          {/* 右上角三点菜单 */}
          <button className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors" onClick={(e) => e.preventDefault()}>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          {/* 格式图标 */}
          <div className={`w-24 h-28 ${formatStyle.bg} rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative`}>
            {/* 文件折角效果 */}
            <div className="absolute top-0 right-0 w-7 h-7 bg-white/20 rounded-bl-2xl" />
            {formatStyle.icon}
          </div>
        </div>

        {/* 文档信息 */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200 mb-3 leading-relaxed min-h-[40px]">
            {doc.title}
          </h3>

          <div className="flex items-center justify-between">
            {/* 左侧：格式标签 + 免费标签 */}
            <div className="flex items-center gap-2">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${formatTagColors[doc.format] || 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                {doc.format}
              </span>
              {doc.price === 0 ? (
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-500 border border-emerald-200">
                  {t('document.free')}
                </span>
              ) : null}
            </div>

            {/* 右侧：星币 */}
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-sm">⭐</span>
              <span className="text-gray-500 text-sm">{doc.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
