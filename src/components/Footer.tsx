'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function Footer() {
  const { t } = useTranslation();
  return <footer className="mt-auto border-t border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8"><div><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#17324d] text-xs font-black text-white">SL</span><div><p className="font-bold text-slate-800">{t('site.name')}</p><p className="text-[10px] tracking-[0.12em] text-slate-400">STANDARD ARCHIVE</p></div></div><p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">为标准与合规资料建立更清晰的检索、权限与下载记录。</p></div><div><p className="text-xs font-bold tracking-[0.14em] text-sky-700">BROWSE</p><div className="mt-4 grid gap-2 text-sm text-slate-500"><Link href="/category/行业标准" className="hover:text-sky-700">{t('nav.industry')}</Link><Link href="/category/国家标准" className="hover:text-sky-700">{t('nav.national')}</Link><Link href="/category/国际标准" className="hover:text-sky-700">{t('nav.international')}</Link></div></div><div><p className="text-xs font-bold tracking-[0.14em] text-sky-700">PLATFORM</p><div className="mt-4 grid gap-2 text-sm text-slate-500"><Link href="/about" className="hover:text-sky-700">{t('nav.about')}</Link><Link href="/admin" className="hover:text-sky-700">资料运营台</Link><p className="pt-3 text-xs text-slate-400">{t('site.copyright')}</p></div></div></div></footer>;
}
