'use client';

import Link from 'next/link';
import DocumentCard from '@/components/DocumentCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { useTranslation } from '@/lib/i18n';
import type { searchDocuments } from '@/lib/queries';

type SearchResults = Awaited<ReturnType<typeof searchDocuments>>;

interface SearchContentProps {
  results: SearchResults;
  query: string;
  currentPage: number;
  totalPages: number;
  searchTime: number;
}

export default function SearchContent({
  results,
  query,
  currentPage,
  totalPages,
  searchTime,
}: SearchContentProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f5f9fd]">
      {/* Search Header */}
      <div className="border-b border-slate-200 bg-[#eaf5ff] py-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-xs font-bold tracking-[0.18em] text-sky-700">STANDARD ARCHIVE</p><h1 className="mt-2 text-2xl font-bold text-slate-800 mb-4">{t('search.title')}</h1>
          <SearchBar large placeholder={t('search.placeholder')} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results */}
        {query ? (
          <>
            <div className="mb-6 flex items-center justify-between animate-fade-in">
              <p className="text-gray-500">
                {t('search.result', { query, count: results.total })}
              </p>
              <span className="text-sm text-gray-400">{t('search.time', { ms: searchTime })}</span>
            </div>

            {results.documents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {results.documents.map((doc, index) => (
                    <div key={doc.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                      <DocumentCard doc={doc} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/search?q=${encodeURIComponent(query)}`}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-medium text-gray-700 mb-2">{t('search.notFound')}</h3>
                <p className="text-gray-400 mb-6">{t('search.tryOther')}</p>
                <div className="flex items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 btn-sheen bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {t('search.backHome')}
                  </Link>
                  <Link
                    href="/category/行业标准"
                    className="inline-block px-6 py-3 glass text-gray-600 font-medium rounded-xl transition-all duration-300 hover:bg-white/60"
                  >
                    {t('search.browseCategories')}
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-medium text-gray-700 mb-2">{t('search.inputPlaceholder')}</h3>
            <p className="text-gray-400">{t('search.searchDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
