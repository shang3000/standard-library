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
    url.searchParams.delete('page');
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

  const handleReset = () => {
    router.push(baseUrl);
  };

  const hasFilters = currentFormats.length > 0 || isFree || isVip || sort !== 'latest';

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
          筛选条件
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </h3>
      </div>

      {/* 格式筛选 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">文档格式</h4>
        <div className="space-y-2.5">
          {formats.map((format) => (
            <label key={format} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={currentFormats.includes(format)}
                  onChange={() => toggleFormat(format)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded-md border-2 border-gray-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all duration-200 flex items-center justify-center">
                  {currentFormats.includes(format) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">{format}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 价格筛选 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">价格</h4>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => updateFilter('free', e.target.checked ? '1' : null)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border-2 border-gray-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all duration-200 flex items-center justify-center">
                {isFree && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">免费文档</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isVip}
                onChange={(e) => updateFilter('vip', e.target.checked ? '1' : null)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border-2 border-gray-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all duration-200 flex items-center justify-center">
                {isVip && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">VIP 文档</span>
          </label>
        </div>
      </div>

      {/* 排序方式 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">排序方式</h4>
        <select
          value={sort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-600 appearance-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
        >
          <option value="latest">最新上传</option>
          <option value="downloads">最多下载</option>
          <option value="price_asc">价格从低到高</option>
          <option value="price_desc">价格从高到低</option>
        </select>
      </div>

      {/* 重置筛选按钮 */}
      <button
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        重置筛选
      </button>
    </div>
  );
}
