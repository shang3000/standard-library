import { notFound } from 'next/navigation';
import DocDetailContent from '@/components/DocDetailContent';
import { getDocumentById, getRelatedDocuments } from '@/lib/queries';

export const dynamic = 'force-dynamic';

interface DocDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocDetailPage({ params }: DocDetailPageProps) {
  const { id } = await params;
  const doc = await getDocumentById(id);

  if (!doc) {
    notFound();
  }

  const relatedDocs = await getRelatedDocuments(Number(doc.id), doc.id, 4);

  return <DocDetailContent document={doc} relatedDocs={relatedDocs} />;
}
