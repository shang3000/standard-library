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
  const navItems = [{ name: t('nav.home'), href: '/' }, { name: t('nav.industry'), href: '/category/行业标准' }, { name: t('nav.national'), href: '/category/国家标准' }, { name: t('nav.international'), href: '/category/国际标准' }, { name: t('nav.about'), href: '/about' }];
  const itemClass = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'bg-sky-50 text-sky-800' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800';
  return <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex h-[68px] items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#17324d] text-xs font-black tracking-wider text-white">SL</span><span className="hidden sm:block"><span className="block text-sm font-bold leading-tight text-slate-800">{t('site.name')}</span><span className="block text-[10px] tracking-[0.12em] text-slate-400">STANDARD ARCHIVE</span></span></Link><div className="hidden items-center gap-1 md:flex">{navItems.map((item) => <Link key={item.href} href={item.href} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${itemClass(item.href)}`}>{item.name}</Link>)}</div><div className="hidden items-center gap-3 md:flex"><button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:border-sky-300 hover:text-sky-700">{locale === 'zh' ? 'EN' : '中'}</button><UserMenu /></div><div className="flex items-center gap-2 md:hidden"><button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600">{locale === 'zh' ? 'EN' : '中'}</button><button aria-label="切换导航菜单" onClick={() => setIsOpen(!isOpen)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg></button></div></div></div><div className={`overflow-hidden border-t border-slate-100 transition-all md:hidden ${isOpen ? 'max-h-80' : 'max-h-0'}`}><div className="space-y-1 px-4 py-3">{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className={`block rounded-lg px-3 py-2 text-sm font-medium ${itemClass(item.href)}`}>{item.name}</Link>)}<div className="border-t border-slate-100 pt-2"><UserMenu /></div></div></div></nav>;
}
