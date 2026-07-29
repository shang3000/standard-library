import { getCategories, getLatestDocuments, getDocumentStats } from '@/lib/queries';
import HomeContent from '@/components/HomeContent';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categories = await getCategories();
  const latestDocs = await getLatestDocuments(6);
  const stats = await getDocumentStats();

  return (
    <HomeContent
      categories={categories}
      latestDocs={latestDocs}
      stats={stats}
    />
  );
}
