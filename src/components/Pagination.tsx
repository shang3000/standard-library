'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // 显示最多7个页码

    if (totalPages <= maxVisible) {
      // 总页数少于最大可见数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 始终显示第一页
      pages.push(1);

      // 计算显示范围：当前页前3后3
      let start = Math.max(2, currentPage - 3);
      let end = Math.min(totalPages - 1, currentPage + 3);

      // 调整范围，确保显示足够的页码
      if (currentPage <= 4) {
        // 当前页靠近开头，显示更多后面的页码
        start = 2;
        end = Math.min(totalPages - 1, 6);
      } else if (currentPage >= totalPages - 3) {
        // 当前页靠近结尾，显示更多前面的页码
        start = Math.max(2, totalPages - 5);
        end = totalPages - 1;
      }

      // 添加省略号（如果需要）
      if (start > 2) {
        pages.push('...');
      }

      // 添加中间页码
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // 添加省略号（如果需要）
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // 始终显示最后一页
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  // 构建基础 URL（处理已有的查询参数）
  const buildUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      {/* 上一页 */}
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200 text-sm"
        >
          上一页
        </Link>
      )}

      {/* 页码 */}
      {getPageNumbers().map((page, index) => (
        <span key={index}>
          {page === '...' ? (
            <span className="px-2 py-2 text-gray-500 text-sm">...</span>
          ) : (
            <Link
              href={buildUrl(page as number)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                currentPage === page
                  ? 'bg-primary text-white cursor-default'
                  : 'bg-white text-gray-700 hover:bg-primary hover:text-white'
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Link>
          )}
        </span>
      ))}

      {/* 下一页 */}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-3 py-2 rounded-lg bg-white text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200 text-sm"
        >
          下一页
        </Link>
      )}
    </div>
  );
}