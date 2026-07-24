'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  large?: boolean;
}

export default function SearchBar({ placeholder = '搜索标准文档...', large = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={`flex items-center bg-white rounded-lg shadow-md overflow-hidden ${large ? 'p-2' : 'p-1'}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 px-4 py-3 text-gray-700 focus:outline-none ${
            large ? 'text-lg' : 'text-sm'
          }`}
        />
        <button
          type="submit"
          className={`bg-primary hover:bg-primary-dark text-white font-medium transition-colors duration-200 ${
            large ? 'px-8 py-3 text-lg' : 'px-6 py-2 text-sm'
          } rounded-lg`}
        >
          搜索
        </button>
      </div>
    </form>
  );
}