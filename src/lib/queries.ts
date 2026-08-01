export {
  getCategories,
  getLatestDocuments,
  getDocumentsByCategory,
  getDocumentById,
  getRelatedDocuments,
  searchDocuments,
  getPopularDocuments,
} from './sqljs-repository';

export async function incrementDownloadCount() {
  // 下载计数在 redeemDownload 中与余额、下载记录一起原子更新。
}

export async function getDocumentStats() {
  const { getAdminOverview, getCategories } = await import('./sqljs-repository');
  const [overview, categories] = await Promise.all([getAdminOverview(), getCategories()]);
  return {
    totalDocs: overview.summary.documentCount,
    totalCategories: categories.length,
    totalUsers: overview.summary.userCount,
    totalDownloads: overview.summary.downloadCount,
    todayNewDocs: 0,
    todayUpdates: 0,
  };
}
