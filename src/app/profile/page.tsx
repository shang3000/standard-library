import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import ProfileContent from '@/components/ProfileContent';

interface Download {
  id: number;
  docId: number;
  starsPaid: number;
  downloadedAt: string;
  title: string;
  format: string;
  fileSize: string;
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const db = await getDb();

  // 获取下载历史（最近 20 条）
  const downloadsResult = db.exec(
    `SELECT d.id, d.doc_id, d.stars_paid, d.downloaded_at,
            doc.title, doc.format, doc.file_size
     FROM downloads d
     JOIN documents doc ON d.doc_id = doc.id
     WHERE d.user_id = ?
     ORDER BY d.downloaded_at DESC
     LIMIT 20`,
    [user.id]
  );

  const downloads: Download[] = downloadsResult.length > 0
    ? downloadsResult[0].values.map((row: unknown[]) => ({
        id: row[0] as number,
        docId: row[1] as number,
        starsPaid: row[2] as number,
        downloadedAt: row[3] as string,
        title: row[4] as string,
        format: row[5] as string,
        fileSize: row[6] as string,
      }))
    : [];

  return (
    <ProfileContent
      username={user.username}
      email={user.email}
      isVip={user.isVip}
      starsBalance={user.starsBalance}
      downloads={downloads}
    />
  );
}
