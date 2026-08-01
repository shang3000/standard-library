import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDownloadRecords } from '@/lib/sqljs-repository';
import ProfileContent from '@/components/ProfileContent';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const records = await getDownloadRecords(user.id);

  return <ProfileContent
    username={user.username}
    email={user.email}
    isVip={user.isVip}
    starsBalance={user.starsBalance}
    downloads={records}
  />;
}
