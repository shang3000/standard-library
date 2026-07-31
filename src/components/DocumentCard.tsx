'use client';

import Link from 'next/link';
import { Document } from '@/types';
import { useTranslation } from '@/lib/i18n';

interface DocumentCardProps { doc: Document }

const formatTone: Record<string, { paper: string; label: string }> = {
  PDF: { paper: 'from-rose-500 to-[#9e334a]', label: 'text-rose-700 bg-rose-50' }, DOC: { paper: 'from-blue-500 to-[#24548e]', label: 'text-blue-700 bg-blue-50' }, PPT: { paper: 'from-orange-500 to-[#a14c2b]', label: 'text-orange-700 bg-orange-50' }, XLS: { paper: 'from-emerald-500 to-[#1f6854]', label: 'text-emerald-700 bg-emerald-50' },
};

export default function DocumentCard({ doc }: DocumentCardProps) {
  const { t } = useTranslation();
  const tone = formatTone[doc.format] ?? formatTone.PDF;
  return <Link href={`/doc/${doc.id}`} className="group block h-full"><article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><span className="text-[10px] font-bold tracking-[0.15em] text-slate-400">ARCHIVE #{doc.id.padStart(4, '0')}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${tone.label}`}>{doc.format}</span></div><div className="relative px-5 py-7"><div className={`absolute inset-0 bg-gradient-to-br ${tone.paper} opacity-[0.07]`} /><div className="relative flex h-28 items-center justify-center"><div className={`flex h-24 w-20 flex-col rounded-sm bg-gradient-to-br ${tone.paper} p-3 text-white shadow-lg transition duration-300 group-hover:scale-105`}><span className="text-lg font-black">{doc.format}</span><span className="mt-2 h-px bg-white/50" /><span className="mt-2 h-px w-3/4 bg-white/50" /><span className="mt-auto text-[8px] tracking-widest text-white/70">STANDARD</span></div></div></div><div className="flex flex-1 flex-col p-5"><div className="flex items-center gap-2"><span className="max-w-[70%] truncate text-xs text-slate-400">{doc.category}</span>{doc.isVip && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">VIP</span>}</div><h3 className="mt-3 min-h-12 text-sm font-bold leading-6 text-slate-700 transition group-hover:text-sky-800">{doc.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{doc.description || '资料已归档，可查看文件信息与获取条件。'}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs text-slate-400">{doc.downloadCount} 次获取</span><span className="text-xs font-bold text-sky-700">{doc.price === 0 ? t('document.free') : `${doc.price} 星币`} →</span></div></div></article></Link>;
}
