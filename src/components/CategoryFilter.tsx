'use client';

import { useRouter } from 'next/navigation';
import { DocFormat } from '@/types';

const formats: DocFormat[] = ['PDF', 'DOC', 'PPT', 'XLS'];

interface CategoryFilterProps {
  currentFormats: DocFormat[];
  isFree: boolean;
  isVip: boolean;
  sort: string;
  baseUrl: string;
}

export default function CategoryFilter({
  currentFormats,
  isFree,
  isVip,
  sort,
  baseUrl,
}: CategoryFilterProps) {
  const router = useRouter();

  const updateFilter = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    url.searchParams.delete('page'); // Reset page when filter changes
    router.push(url.pathname + url.search);
  };

  const toggleFormat = (format: DocFormat) => {
    const newFormats = currentFormats.includes(format)
      ? currentFormats.filter((f) => f !== format)
      : [...currentFormats, format];

    if (newFormats.length === 0) {
      updateFilter('format', null);
    } else {
      updateFilter('format', newFormats.join(','));
    }
  };

  return (
    <aside className="lg:w-64 flex-shrink-0">
      <div className="bg-card-bg rounded-lg shadow-md p-6 sticky top-24">
        <h3 className="font-bold text-gray-800 mb-4">筛选条件</h3>

        {/* Format Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">文档格式</h4>
          <div className="space-y-2">
            {formats.map((format) => (
              <label key={format} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFormats.includes(format)}
                  onChange={() => toggleFormat(format)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600">{format}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">价格</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => updateFilter('free', e.target.checked ? '1' : null)}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">免费文档</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVip}
                onChange={(e) => updateFilter('vip', e.target.checked ? '1' : null)}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">VIP 文档</span>
            </label>
          </div>
        </div>

        {/* Sort */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">排序方式</h4>
          <select
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="latest">最新上传</option>
            <option value="downloads">最多下载</option>
            <option value="price_asc">价格从低到高</option>
            <option value="price_desc">价格从高到低</option>
          </select>
        </div>
      </div>
    </aside>
  );
}