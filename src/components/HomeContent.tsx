'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

const categoryStyle: Record<string, string> = {
  行业标准: 'border-emerald-200 bg-emerald-50 text-emerald-700', 国家标准: 'border-sky-200 bg-sky-50 text-sky-700', 国际标准: 'border-violet-200 bg-violet-50 text-violet-700', 企业标准: 'border-amber-200 bg-amber-50 text-amber-700', 地方标准: 'border-rose-200 bg-rose-50 text-rose-700', 团体标准: 'border-cyan-200 bg-cyan-50 text-cyan-700',
};
const formatStyle: Record<string, string> = { PDF: 'bg-rose-50 text-rose-700', DOC: 'bg-blue-50 text-blue-700', PPT: 'bg-orange-50 text-orange-700', XLS: 'bg-emerald-50 text-emerald-700' };

interface HomeContentProps {
  categories: Array<{ id: string; name: string; slug: string; icon: string; count: number }>;
  latestDocs: Array<{ id: string; title: string; category: string; format: string; description?: string; uploadDate: string }>;
  stats: { totalDocs: number; totalCategories: number; totalUsers: number; totalDownloads: number; todayUpdates: number };
}

export default function HomeContent({ categories, latestDocs, stats }: HomeContentProps) {
  const { t } = useTranslation();
  const hotSearchTags = [t('tags.quality'), t('tags.env'), t('tags.infosec'), t('tags.health'), t('tags.iso9001'), t('tags.iso14001')];

  return (
    <main className="min-h-screen bg-[#f5f9fd] text-slate-800">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#eaf5ff]"><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/archive-atmosphere-v1.png')" }} /><div className="absolute inset-0 bg-gradient-to-r from-[#eaf5ff] via-[#eaf5ff]/90 to-[#eaf5ff]/20" /><div className="absolute right-[8%] top-[-90px] h-80 w-80 rounded-full border-[36px] border-white/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="max-w-3xl"><p className="text-xs font-bold tracking-[0.2em] text-sky-700">STANDARD LIBRARY / 资料检索</p><h1 className="mt-4 text-4xl font-bold tracking-tight text-[#17324d] sm:text-5xl">把需要的标准资料，<br /><span className="text-[#1f6f8b]">准确地找到手边。</span></h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">面向标准与合规资料的受控检索平台。支持分类浏览、关键词查找、访问权限校验与下载记录追溯。</p>
            <form action="/search" method="GET" className="mt-8 max-w-2xl"><div className="flex rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-sky-100"><div className="flex flex-1 items-center pl-3"><span className="mr-3 text-lg text-slate-400">⌕</span><input name="q" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400" placeholder="输入标准名称、行业关键词或资料类型" /></div><button className="rounded-xl bg-[#17324d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#254c70]">开始检索</button></div></form>
            <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-xs text-slate-500">常用检索：</span>{hotSearchTags.map((tag) => <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs text-sky-700 transition hover:bg-white">{tag}</Link>)}</div>
          </div></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="relative z-10 -mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70 sm:grid-cols-4">{[[stats.totalDocs, '已归档资料', 'ARCHIVE'], [stats.totalCategories, '覆盖分类', 'CATALOG'], [stats.totalUsers, '注册用户', 'USERS'], [stats.totalDownloads, '受控下载', 'DOWNLOADS']].map(([value, label, code], index) => <div key={String(code)} className={`p-5 ${index < 3 ? 'border-r border-slate-100' : ''}`}><p className="text-[10px] font-bold tracking-[0.16em] text-sky-700">{code}</p><p className="mt-2 text-2xl font-bold text-slate-800">{Number(value).toLocaleString()}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}</div></section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><section><div className="flex items-end justify-between"><div><p className="text-xs font-bold tracking-[0.18em] text-sky-700">BROWSE BY CATALOG</p><h2 className="mt-1 text-2xl font-bold text-slate-800">从分类开始浏览</h2><p className="mt-2 text-sm text-slate-500">每个分类都汇总了可查询的标准与资料。</p></div></div><div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{categories.map((category) => <Link key={category.id} href={`/category/${category.slug}`} className={`group rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${categoryStyle[category.name] ?? 'border-slate-200 bg-white text-slate-700'}`}><div className="flex items-start justify-between"><span className="text-2xl">{category.icon}</span><span className="text-xs opacity-60">{String(category.count).padStart(2, '0')}</span></div><p className="mt-6 text-sm font-bold">{category.name}</p><p className="mt-1 text-xs opacity-70">份资料 →</p></Link>)}</div></section>

        <section className="mt-14 grid gap-7 lg:grid-cols-[1.4fr_0.8fr]"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><p className="text-xs font-bold tracking-[0.18em] text-sky-700">RECENTLY ADDED</p><h2 className="mt-1 text-xl font-bold text-slate-800">最新归档资料</h2></div><Link href="/category/行业标准" className="text-sm font-medium text-sky-700 hover:text-sky-900">查看目录 →</Link></div><div className="divide-y divide-slate-100">{latestDocs.map((doc) => <Link key={doc.id} href={`/doc/${doc.id}`} className="flex items-center gap-4 px-6 py-5 transition hover:bg-sky-50/60"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-black ${formatStyle[doc.format] ?? 'bg-slate-100 text-slate-600'}`}>{doc.format}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-semibold text-slate-700">{doc.title}</p><span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 sm:inline">{doc.category}</span></div><p className="mt-1 truncate text-xs text-slate-400">{doc.description || '资料已完成基础信息归档，可查看详情与获取条件。'}</p></div><div className="hidden text-right sm:block"><p className="text-xs text-slate-400">{doc.uploadDate}</p><p className="mt-1 text-xs font-medium text-sky-700">查看资料</p></div></Link>)}</div></div>
          <aside className="rounded-2xl bg-[#17324d] p-6 text-white shadow-lg shadow-slate-300"><p className="text-xs font-bold tracking-[0.18em] text-sky-200">HOW IT WORKS</p><h2 className="mt-2 text-xl font-bold">有序获取每一份资料</h2><div className="mt-7 space-y-5">{[['01', '检索定位', '按关键词或分类快速缩小范围'], ['02', '确认条件', '查看格式、版本与获取权限'], ['03', '受控下载', '登录后完成权限校验并留存记录']].map(([number, title, description]) => <div key={number} className="flex gap-4"><span className="text-sm font-bold text-[#9de7dc]">{number}</span><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-300">{description}</p></div></div>)}</div><Link href="/about" className="mt-8 inline-block text-sm font-semibold text-[#9de7dc] hover:text-white">了解平台能力 →</Link></aside>
        </section></div>
    </main>
  );
}
