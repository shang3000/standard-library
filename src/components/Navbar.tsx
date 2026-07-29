'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';
import { useTranslation } from '@/lib/i18n';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.industry'), href: '/category/行业标准' },
    { name: t('nav.national'), href: '/category/国家标准' },
    { name: t('nav.international'), href: '/category/国际标准' },
    { name: t('nav.about'), href: '/about' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-gray-800 block leading-tight">{t('site.name')}</span>
                <span className="text-[10px] text-gray-400 leading-none">{t('site.slogan')}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-primary-dark'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side: Language switch + User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-dark border border-gray-200 rounded-lg hover:border-primary/50 transition-all duration-200"
            >
              {locale === 'zh' ? 'EN' : '中'}
            </button>
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
              className="px-2 py-1 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg"
            >
              {locale === 'zh' ? 'EN' : '中'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-dark p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden glass-strong border-t border-white/30 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary-dark bg-primary/10 font-medium'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="border-t border-gray-100 pt-2 mt-2">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
