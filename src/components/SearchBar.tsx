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
      <div className={`glass flex items-center rounded-2xl shadow-lg overflow-hidden ${large ? 'p-2' : 'p-1.5'}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 px-4 py-3 text-gray-700 focus:outline-none bg-transparent placeholder-gray-400 ${
            large ? 'text-lg' : 'text-sm'
          }`}
        />
        <button
          type="submit"
          className={`btn-sheen bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
            large ? 'px-8 py-3 text-lg' : 'px-6 py-2.5 text-sm'
          } rounded-xl`}
        >
          搜索
        </button>
      </div>
    </form>
  );
}