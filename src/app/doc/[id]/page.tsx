import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocumentCard from '@/components/DocumentCard';
import DownloadButton from '@/components/DownloadButton';
import { getDocumentById, getRelatedDocuments, incrementDownloadCount } from '@/lib/queries';

interface DocDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocDetailPage({ params }: DocDetailPageProps) {
  const { id } = await params;
  const doc = await getDocumentById(id);

  if (!doc) {
    notFound();
  }

  // 增加下载次数（模拟浏览时计数）
  await incrementDownloadCount(id);

  const relatedDocs = await getRelatedDocuments(Number(doc.id), doc.id, 4);

  // 格式标签颜色
  const formatColors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700',
    DOC: 'bg-blue-100 text-blue-700',
    PPT: 'bg-orange-100 text-orange-700',
    XLS: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
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
            <span className="text-gray-800">{doc.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card-bg rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            {/* Document Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      formatColors[doc.format] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {doc.format}
                  </span>
                  {doc.isVip && (
                    <span className="inline-block px-3 py-1 rounded bg-yellow-100 text-yellow-700 text-sm font-medium">
                      VIP
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{doc.title}</h1>
                <p className="text-gray-600 leading-relaxed">{doc.description}</p>
              </div>

              {/* Price and Download */}
              <div className="flex flex-col items-center md:items-end space-y-4">
                <div className="text-center md:text-right">
                  {doc.price === 0 ? (
                    <span className="text-3xl font-bold text-green-600">免费</span>
                  ) : (
                    <div>
                      <span className="text-sm text-gray-500">价格</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500 text-2xl">⭐</span>
                        <span className="text-3xl font-bold text-primary-dark">{doc.price}</span>
                        <span className="text-gray-500">星币</span>
                      </div>
                    </div>
                  )}
                </div>
                <DownloadButton docId={doc.id} price={doc.price} isVip={doc.isVip} />
              </div>
            </div>

            {/* Document Info Table */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">文档信息</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">页数</p>
                  <p className="text-lg font-medium text-gray-800">{doc.pages} 页</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">文件大小</p>
                  <p className="text-lg font-medium text-gray-800">{doc.size}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">上传时间</p>
                  <p className="text-lg font-medium text-gray-800">{doc.uploadDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">下载次数</p>
                  <p className="text-lg font-medium text-gray-800">{doc.downloadCount} 次</p>
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