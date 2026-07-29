import { searchDocuments } from '@/lib/queries';
import SearchContent from '@/components/SearchContent';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page } = await searchParams;
  const query = q || '';
  const currentPage = Number(page) || 1;
  const pageSize = 20;
  const offset = (currentPage - 1) * pageSize;

  let results: Awaited<ReturnType<typeof searchDocuments>> = { documents: [], total: 0 };
  let searchTime = 0;

  if (query) {
    const startTime = Date.now();
    results = await searchDocuments(query, pageSize, offset);
    searchTime = Date.now() - startTime;
  }

  const totalPages = Math.ceil(results.total / pageSize);

  return (
    <SearchContent
      results={results}
      query={query}
      currentPage={currentPage}
      totalPages={totalPages}
      searchTime={searchTime}
    />
  );
}
