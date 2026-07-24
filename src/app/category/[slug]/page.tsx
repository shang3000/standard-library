import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocumentCard from '@/components/DocumentCard';
import Pagination from '@/components/Pagination';
import CategoryFilter from '@/components/CategoryFilter';
import { getCategories, getDocumentsByCategory } from '@/lib/queries';
import { DocFormat } from '@/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; format?: string; free?: string; vip?: string; sort?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const sp = await searchParams;

  // 获取分类信息
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === decodedSlug);

  if (!category) {
    notFound();
  }

  // 解析筛选参数
  const currentPage = Number(sp.page) || 1;
  const pageSize = 20;
  const offset = (currentPage - 1) * pageSize;

  const formats = sp.format ? (sp.format.split(',') as DocFormat[]) : [];
  const isFree = sp.free === '1';
  const isVip = sp.vip === '1';
  const sort = sp.sort || 'latest';

  // 获取文档
  const { documents, total } = await getDocumentsByCategory(decodedSlug, pageSize, offset, {
    formats,
    isFree,
    isVip,
    sort,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{category.icon || '📁'}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{category.name}</h1>
              <p className="text-white/80 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Filter Panel */}
          <CategoryFilter
            currentFormats={formats}
            isFree={isFree}
            isVip={isVip}
            sort={sort}
            baseUrl={`/category/${slug}`}
          />

          {/* Right Content */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                共找到 <span className="font-bold text-primary-dark">{total}</span> 份文档
              </p>
            </div>

            {/* Document Grid */}
            {documents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/category/${slug}`}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">📭</span>
                <h3 className="text-xl font-medium text-gray-800 mb-2">暂无符合条件的文档</h3>
                <p className="text-gray-500">请尝试调整筛选条件</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}