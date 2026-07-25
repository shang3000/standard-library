import Link from 'next/link';
import DocumentCard from '@/components/DocumentCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { searchDocuments } from '@/lib/queries';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const query = q || '';
  const currentPage = Number(page) || 1;
  const pageSize = 20;
  const offset = (currentPage - 1) * pageSize;

  let results: Awaited<ReturnType<typeof searchDocuments>> = { documents: [], total: 0 };
  let searchTime = 0;

  if (query) {
    const startTime = Date.now();
    results = await searchDocuments(query, pageSize, offset);
    searchTime = Date.now() - startTime;
  }

  const totalPages = Math.ceil(results.total / pageSize);

  return (
    <div className="min-h-screen mesh-bg">
      {/* Search Header */}
      <div className="py-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-2xl font-bold text-gradient mb-4">搜索文档</h1>
          <SearchBar large placeholder="搜索标准文档..." />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Results */}
        {query ? (
          <>
            <div className="mb-6 flex items-center justify-between animate-fade-in">
              <p className="text-gray-500">
                搜索 &quot;<span className="font-bold text-primary-dark">{query}</span>&quot; 找到{' '}
                <span className="font-bold text-primary-dark">{results.total}</span> 份文档
              </p>
              <span className="text-sm text-gray-400">耗时 {searchTime}ms</span>
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
                <h3 className="text-xl font-medium text-gray-700 mb-2">未找到相关文档</h3>
                <p className="text-gray-400 mb-6">试试其他关键词，或者浏览我们的分类文档</p>
                <div className="flex items-center justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 btn-sheen bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    返回首页
                  </Link>
                  <Link
                    href="/category/行业标准"
                    className="inline-block px-6 py-3 glass text-gray-600 font-medium rounded-xl transition-all duration-300 hover:bg-white/60"
                  >
                    浏览分类
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-xl font-medium text-gray-700 mb-2">请输入搜索关键词</h3>
            <p className="text-gray-400">搜索行业标准、国家标准、国际标准等文档</p>
          </div>
        )}
      </div>
    </div>
  );
}