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

// 分类对应的图标和颜色
const categoryConfig: Record<string, { icon: string; bg: string; text: string }> = {
  '行业标准': { icon: '🏢', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  '国家标准': { icon: '🏛️', bg: 'bg-orange-100', text: 'text-orange-600' },
  '国际标准': { icon: '🌍', bg: 'bg-blue-100', text: 'text-blue-600' },
  '企业标准': { icon: '🏭', bg: 'bg-purple-100', text: 'text-purple-600' },
  '地方标准': { icon: '📍', bg: 'bg-pink-100', text: 'text-pink-600' },
  '团体标准': { icon: '👥', bg: 'bg-cyan-100', text: 'text-cyan-600' },
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const sp = await searchParams;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === decodedSlug);

  if (!category) {
    notFound();
  }

  const currentPage = Number(sp.page) || 1;
  const pageSize = 12;
  const offset = (currentPage - 1) * pageSize;

  const formats = sp.format ? (sp.format.split(',') as DocFormat[]) : [];
  const isFree = sp.free === '1';
  const isVip = sp.vip === '1';
  const sort = sp.sort || 'latest';

  const { documents, total } = await getDocumentsByCategory(decodedSlug, pageSize, offset, {
    formats,
    isFree,
    isVip,
    sort,
  });

  const totalPages = Math.ceil(total / pageSize);
  const config = categoryConfig[category.name] || { icon: '📄', bg: 'bg-gray-100', text: 'text-gray-600' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[220px]">
        {/* 背景图 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-bg.png)' }}
        />
        {/* 轻度渐变遮罩 - 让地球可见 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 h-full flex flex-col justify-center">
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-emerald-600 transition-colors duration-200">首页</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600">{category.name}</span>
          </nav>

          {/* 分类信息 */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${config.bg} rounded-2xl flex items-center justify-center shadow-sm`}>
              <span className="text-2xl">{config.icon}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
              <p className="text-gray-500 mt-1 text-sm">
                收录{category.name} <span className="text-emerald-600 font-semibold">{total}</span> 份，持续更新，权威可靠
              </p>
              <p className="text-gray-400 text-sm mt-0.5">{category.description || '覆盖各行业各领域的国家级技术规范与要求'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 主内容区域 - 白色背景带顶部圆弧 */}
      <div className="bg-white rounded-t-[40px] -mt-6 relative z-10 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧筛选面板 */}
          <aside className="lg:w-56 flex-shrink-0">
            <CategoryFilter
              currentFormats={formats}
              isFree={isFree}
              isVip={isVip}
              sort={sort}
              baseUrl={`/category/${slug}`}
            />
          </aside>

          {/* 右侧内容 */}
          <main className="flex-1 min-w-0">
            {/* 结果统计 + 排序/视图 */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-500 text-sm">
                共找到 <span className="font-bold text-emerald-600">{total}</span> 份文档
              </p>
              <div className="flex items-center gap-3">
                {/* 排序 */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>创建时间</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* 视图切换 */}
                <div className="flex gap-1">
                  <button className="w-9 h-9 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="w-9 h-9 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 文档网格 */}
            {documents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {documents.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/category/${slug}`}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <span className="text-6xl mb-4 block">📭</span>
                <h3 className="text-xl font-medium text-gray-700 mb-2">暂无符合条件的文档</h3>
                <p className="text-gray-400">请尝试调整筛选条件</p>
              </div>
            )}
          </main>
        </div>
      </div>
      </div>
    </div>
  );
}
