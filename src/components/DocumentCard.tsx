import Link from 'next/link';
import { Document } from '@/types';

interface DocumentCardProps {
  doc: Document;
}

export default function DocumentCard({ doc }: DocumentCardProps) {
  // 格式标签颜色
  const formatColors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700',
    DOC: 'bg-blue-100 text-blue-700',
    PPT: 'bg-orange-100 text-orange-700',
    XLS: 'bg-green-100 text-green-700',
  };

  return (
    <Link href={`/doc/${doc.id}`} className="group">
      <div className="bg-card-bg rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        {/* 灰色占位图 */}
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl">📄</span>
            <p className="text-gray-500 text-sm mt-2">{doc.format} 文档</p>
          </div>
        </div>

        {/* 文档信息 */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-primary-dark transition-colors duration-200 mb-3">
            {doc.title}
          </h3>

          <div className="flex items-center justify-between">
            {/* 格式标签 */}
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                formatColors[doc.format] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {doc.format}
            </span>

            {/* 星币价格 */}
            <div className="flex items-center space-x-1">
              {doc.price === 0 ? (
                <span className="text-green-600 font-medium text-sm">免费</span>
              ) : (
                <>
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-primary-dark font-medium text-sm">{doc.price}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}