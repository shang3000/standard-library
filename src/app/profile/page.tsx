import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

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

  // 格式标签颜色
  const formatColors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700',
    DOC: 'bg-blue-100 text-blue-700',
    PPT: 'bg-orange-100 text-orange-700',
    XLS: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 用户信息卡片 */}
        <div className="bg-card-bg rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{user.username}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="text-right">
              {user.isVip && (
                <span className="inline-block px-3 py-1 rounded bg-yellow-100 text-yellow-700 font-medium mb-2">
                  VIP 会员
                </span>
              )}
              <div className="flex items-center justify-end space-x-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="text-2xl font-bold text-primary-dark">{user.starsBalance}</span>
                <span className="text-gray-500">星币</span>
              </div>
            </div>
          </div>
        </div>

        {/* 下载历史 */}
        <div className="bg-card-bg rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">下载历史</h2>
          </div>

          {downloads.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {downloads.map((download) => (
                <Link
                  key={download.id}
                  href={`/doc/${download.docId}`}
                  className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 truncate">{download.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          formatColors[download.format] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {download.format}
                      </span>
                      <span className="text-xs text-gray-500">{download.fileSize}</span>
                      <span className="text-xs text-gray-500">{download.downloadedAt}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {download.starsPaid > 0 ? (
                      <span className="text-sm text-gray-500">
                        -{download.starsPaid} ⭐
                      </span>
                    ) : (
                      <span className="text-sm text-green-600">免费</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📭</span>
              <p className="text-gray-500">暂无下载记录</p>
              <Link
                href="/"
                className="inline-block mt-4 text-primary hover:text-primary-dark font-medium"
              >
                去浏览文档 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}