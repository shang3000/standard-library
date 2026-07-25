import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocumentCard from '@/components/DocumentCard';
import DownloadButton from '@/components/DownloadButton';
import { getDocumentById, getRelatedDocuments } from '@/lib/queries';

interface DocDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocDetailPage({ params }: DocDetailPageProps) {
  const { id } = await params;
  const doc = await getDocumentById(id);

  if (!doc) {
    notFound();
  }

  const relatedDocs = await getRelatedDocuments(Number(doc.id), doc.id, 4);

  // 格式标签颜色（渐变风格）
  const formatColors: Record<string, string> = {
    PDF: 'bg-gradient-to-r from-red-400 to-rose-500 text-white',
    DOC: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
    PPT: 'bg-gradient-to-r from-orange-400 to-amber-500 text-white',
    XLS: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white',
  };

  return (
    <div className="min-h-screen mesh-bg">
      {/* Breadcrumb */}
      <div className="glass-strong border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary-dark transition-colors duration-200">
              首页
            </Link>
            <span>/</span>
            <Link
              href={`/category/${doc.categorySlug}`}
              className="hover:text-primary-dark transition-colors duration-200"
            >
              {doc.category}
            </Link>
            <span>/</span>
            <span className="text-gray-600">{doc.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-strong rounded-3xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="p-8">
            {/* Document Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                      formatColors[doc.format] || 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {doc.format}
                  </span>
                  {doc.isVip && (
                    <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-medium shadow-sm">
                      VIP
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{doc.title}</h1>
                <p className="text-gray-500 leading-relaxed">{doc.description}</p>
              </div>

              {/* Price and Download */}
              <div className="flex flex-col items-center md:items-end space-y-4">
                <div className="text-center md:text-right">
                  {doc.price === 0 ? (
                    <span className="text-3xl font-bold text-emerald-500">免费</span>
                  ) : (
                    <div>
                      <span className="text-sm text-gray-400">价格</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400 text-2xl">⭐</span>
                        <span className="text-3xl font-bold text-primary-dark">{doc.price}</span>
                        <span className="text-gray-400">星币</span>
                      </div>
                    </div>
                  )}
                </div>
                <DownloadButton docId={doc.id} price={doc.price} isVip={doc.isVip} />
              </div>
            </div>

            {/* Document Info Table */}
            <div className="border-t border-white/30 pt-8">
              <h2 className="text-lg font-bold text-gray-700 mb-4">文档信息</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass rounded-2xl p-4">
                  <p className="text-sm text-gray-400 mb-1">页数</p>
                  <p className="text-lg font-medium text-gray-700">{doc.pages} 页</p>
                </div>
                <div className="glass rounded-2xl p-4">
                  <p className="text-sm text-gray-400 mb-1">文件大小</p>
                  <p className="text-lg font-medium text-gray-700">{doc.size}</p>
                </div>
                <div className="glass rounded-2xl p-4">
                  <p className="text-sm text-gray-400 mb-1">上传时间</p>
                  <p className="text-lg font-medium text-gray-700">{doc.uploadDate}</p>
                </div>
                <div className="glass rounded-2xl p-4">
                  <p className="text-sm text-gray-400 mb-1">下载次数</p>
                  <p className="text-lg font-medium text-gray-700">{doc.downloadCount} 次</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Documents */}
        {relatedDocs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">相关推荐</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}