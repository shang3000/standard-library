import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import DocumentCard from '@/components/DocumentCard';
import { getCategories, getLatestDocuments, getPopularDocuments } from '@/lib/queries';

export default async function Home() {
  const categories = await getCategories();
  const latestDocs = await getLatestDocuments(8);
  const popularDocs = await getPopularDocuments(10);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">标准文库</h1>
          <p className="text-xl text-white/90 mb-8">专业标准文档分享平台</p>
          <SearchBar large placeholder="搜索行业标准、国家标准、国际标准..." />
        </div>
      </section>

      {/* Category Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">文档分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="bg-card-bg rounded-lg p-4 text-center hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <span className="text-3xl mb-2 block">{category.icon}</span>
              <h3 className="font-medium text-gray-800 text-sm">{category.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{category.count} 份文档</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Documents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">最新文档</h2>
          <Link href="/category/行业标准" className="text-primary hover:text-primary-dark transition-colors duration-200 text-sm">
            查看更多 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </section>

      {/* Popular Downloads */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🔥 热门下载 TOP 10</h2>
        <div className="bg-card-bg rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-100">
            {popularDocs.map((doc, index) => (
              <Link
                key={doc.id}
                href={`/doc/${doc.id}`}
                className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                    index < 3
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{doc.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{doc.category}</span>
                    <span className="text-xs text-gray-500">{doc.format}</span>
                    <span className="text-xs text-gray-500">下载 {doc.downloadCount}</span>
                  </div>
                </div>
                <div className="ml-4">
                  {doc.price === 0 ? (
                    <span className="text-green-600 font-medium text-sm">免费</span>
                  ) : (
                    <span className="text-primary-dark font-medium text-sm">⭐ {doc.price}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}