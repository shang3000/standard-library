import { notFound } from 'next/navigation';
import CategoryContent from '@/components/CategoryContent';
import { getCategories, getDocumentsByCategory } from '@/lib/queries';
import { DocFormat } from '@/types';

export const dynamic = 'force-dynamic';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; format?: string; free?: string; vip?: string; sort?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const sp = await searchParams;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === decodedSlug);

  if (!category) {
    notFound();
  }

  const currentPage = Number(sp.page) || 1;
  const pageSize = 12;
  const offset = (currentPage - 1) * pageSize;

  const formats = sp.format ? (sp.format.split(',') as DocFormat[]) : [];
  const isFree = sp.free === '1';
  const isVip = sp.vip === '1';
  const sort = sp.sort || 'latest';

  const { documents, total } = await getDocumentsByCategory(decodedSlug, pageSize, offset, {
    formats,
    isFree,
    isVip,
    sort,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <CategoryContent
      categories={categories}
      category={category}
      documents={documents}
      total={total}
      slug={slug}
      currentPage={currentPage}
      totalPages={totalPages}
      formats={formats}
      isFree={isFree}
      isVip={isVip}
      sort={sort}
    />
  );
}
