'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-800">{t('site.name')}</span>
              <p className="text-[10px] text-gray-400">{t('site.slogan')}</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              {t('nav.home')}
            </Link>
            <Link href="/category/行业标准" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              {t('nav.industry')}
            </Link>
            <Link href="/category/国家标准" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              {t('nav.national')}
            </Link>
            <Link href="/category/国际标准" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              {t('nav.international')}
            </Link>
            <Link href="/about" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              {t('nav.about')}
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-400">{t('site.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
