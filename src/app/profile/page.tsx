import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileContent from '@/components/ProfileContent';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const records = await prisma.download.findMany({
    where: { userId: user.id },
    include: { document: { select: { title: true, format: true, fileSize: true } } },
    orderBy: { downloadedAt: 'desc' },
    take: 20,
  });

  return <ProfileContent
    username={user.username}
    email={user.email}
    isVip={user.isVip}
    starsBalance={user.starsBalance}
    downloads={records.map((record) => ({ id: record.id, docId: record.docId, starsPaid: record.starsPaid, downloadedAt: record.downloadedAt.toISOString(), title: record.document.title, format: record.document.format, fileSize: record.document.fileSize ?? '' }))}
  />;
}
