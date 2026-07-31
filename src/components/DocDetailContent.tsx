'use client';

import Link from 'next/link';
import DocumentCard from '@/components/DocumentCard';
import DownloadButton from '@/components/DownloadButton';
import { useTranslation } from '@/lib/i18n';
import { Document } from '@/types';

interface DocDetailContentProps {
  document: Document;
  relatedDocs: Document[];
}

const formatTone: Record<string, { cover: string; chip: string; label: string }> = {
  PDF: { cover: 'from-[#d95050] to-[#8e263b]', chip: 'bg-rose-50 text-rose-700', label: 'PDF 文档' },
  DOC: { cover: 'from-[#4b7fbd] to-[#244e86]', chip: 'bg-blue-50 text-blue-700', label: 'Word 文档' },
  PPT: { cover: 'from-[#dc8431] to-[#a44725]', chip: 'bg-orange-50 text-orange-700', label: '演示文稿' },
  XLS: { cover: 'from-[#34866b] to-[#19604c]', chip: 'bg-emerald-50 text-emerald-700', label: '数据表格' },
};

export default function DocDetailContent({ document: doc, relatedDocs }: DocDetailContentProps) {
  const { t } = useTranslation();
  const tone = formatTone[doc.format] ?? formatTone.PDF;
  const accessLabel = doc.isVip ? 'VIP 专享资料' : doc.price === 0 ? '开放获取' : `${doc.price} 星币获取`;

  return (
    <main className="min-h-screen bg-[#f5f9fd] pb-16">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8"><nav className="flex items-center gap-2 overflow-hidden text-sm text-slate-400"><Link href="/" className="hover:text-sky-700">{t('docDetail.breadcrumb.home')}</Link><span>/</span><Link href={`/category/${doc.categorySlug}`} className="truncate hover:text-sky-700">{doc.category}</Link><span>/</span><span className="truncate text-slate-600">{doc.title}</span></nav></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <div className="grid lg:grid-cols-[320px_1fr]">
            <div className={`relative min-h-[300px] overflow-hidden bg-gradient-to-br ${tone.cover} p-8 text-white`}>
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/20" /><div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full border border-white/15" />
              <div className="relative flex h-full flex-col justify-between"><div><p className="text-xs font-semibold tracking-[0.2em] text-white/70">STANDARD ARCHIVE</p><div className="mt-10 flex h-36 w-28 flex-col rounded-sm bg-white p-4 text-[#17324d] shadow-2xl"><span className="text-xl font-black">{doc.format}</span><span className="mt-2 h-px w-full bg-slate-200" /><span className="mt-2 h-px w-3/4 bg-slate-200" /><span className="mt-auto text-[9px] font-bold tracking-widest text-slate-400">SL / FILE</span></div></div><div><p className="text-sm font-medium">{tone.label}</p><p className="mt-1 text-xs text-white/70">已归入 {doc.category}</p></div></div>
            </div>

            <div className="p-6 sm:p-9"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${tone.chip}`}>{doc.format}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{doc.category}</span>{doc.isVip && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">VIP 专享</span>}</div><h1 className="mt-5 text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">{doc.title}</h1><p className="mt-4 max-w-3xl leading-7 text-slate-500">{doc.description || '该资料已完成基础信息归档，可根据访问权限获取原始文件。'}</p>
              <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-4">{[[t('docDetail.pages'), `${doc.pages} ${t('docDetail.pagesUnit')}`], [t('docDetail.fileSize'), doc.size || '待补充'], [t('docDetail.uploadTime'), doc.uploadDate], [t('docDetail.downloadCount'), `${doc.downloadCount} ${t('docDetail.times')}`]].map(([label, value]) => <div key={label} className="bg-white px-4 py-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 truncate text-sm font-semibold text-slate-700">{value}</p></div>)}</div>
              <div className="mt-7 flex flex-col gap-4 rounded-2xl bg-[#eef7ff] p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold tracking-wider text-sky-700">ACCESS RULE</p><p className="mt-1 font-bold text-slate-800">{accessLabel}</p><p className="mt-1 text-xs text-slate-500">下载前将校验登录状态、VIP 权限与星币余额。</p></div><DownloadButton docId={doc.id} price={doc.price} isVip={doc.isVip} /></div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.45fr_0.75fr]"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-semibold tracking-wider text-sky-700">ABOUT THIS FILE</p><h2 className="mt-1 text-xl font-bold text-slate-800">资料说明</h2><div className="mt-5 border-l-2 border-[#9de7dc] pl-4 text-sm leading-7 text-slate-600">系统为每份资料保留分类、文件规格、上传时间与下载记录。获取后可在个人中心查看历史记录。</div></div><aside className="rounded-2xl border border-slate-200 bg-[#17324d] p-6 text-white shadow-sm"><p className="text-xs font-semibold tracking-wider text-sky-200">ARCHIVE STATUS</p><p className="mt-3 text-lg font-bold">受控文件流转</p><ul className="mt-5 space-y-3 text-sm text-slate-300"><li className="flex gap-2"><span className="text-[#9de7dc]">●</span>元数据已建立</li><li className="flex gap-2"><span className="text-[#9de7dc]">●</span>访问权限已校验</li><li className="flex gap-2"><span className="text-[#9de7dc]">●</span>下载行为可追溯</li></ul></aside></section>

        {relatedDocs.length > 0 && <section className="mt-12"><div className="flex items-end justify-between"><div><p className="text-xs font-semibold tracking-wider text-sky-700">MORE IN {doc.category.toUpperCase()}</p><h2 className="mt-1 text-2xl font-bold text-slate-800">同类资料推荐</h2></div><Link href={`/category/${doc.categorySlug}`} className="text-sm font-medium text-sky-700 hover:text-sky-900">查看分类 →</Link></div><div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{relatedDocs.map((relatedDoc) => <DocumentCard key={relatedDoc.id} doc={relatedDoc} />)}</div></section>}
      </div>
    </main>
  );
}
