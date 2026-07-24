import { Category, Document } from '@/types';

// 6 个分类
export const categories: Category[] = [
  {
    id: '1',
    name: '行业标准',
    slug: '行业标准',
    description: '各行业技术规范与标准文档',
    icon: '📊',
    count: 45,
  },
  {
    id: '2',
    name: '国家标准',
    slug: '国家标准',
    description: '国家发布的各类标准文件',
    icon: '🏛️',
    count: 38,
  },
  {
    id: '3',
    name: '国际标准',
    slug: '国际标准',
    description: 'ISO、IEC 等国际组织标准',
    icon: '🌍',
    count: 25,
  },
  {
    id: '4',
    name: '企业标准',
    slug: '企业标准',
    description: '企业内部管理与技术标准',
    icon: '🏢',
    count: 32,
  },
  {
    id: '5',
    name: '地方标准',
    slug: '地方标准',
    description: '各省市地方标准文件',
    icon: '📍',
    count: 28,
  },
  {
    id: '6',
    name: '团体标准',
    slug: '团体标准',
    description: '行业协会与团体组织标准',
    icon: '👥',
    count: 20,
  },
];

// 20 条文档 mock 数据
export const documents: Document[] = [
  {
    id: '1',
    title: '建筑工程施工质量验收统一标准',
    category: '行业标准',
    categorySlug: '行业标准',
    format: 'PDF',
    price: 0,
    isVip: false,
    pages: 45,
    size: '3.2MB',
    uploadDate: '2024-03-15',
    downloadCount: 1256,
    description: '本标准规定了建筑工程施工质量验收的基本要求、验收程序和验收标准。',
  },
  {
    id: '2',
    title: '信息安全技术 网络安全等级保护基本要求',
    category: '国家标准',
    categorySlug: '国家标准',
    format: 'PDF',
    price: 5,
    isVip: false,
    pages: 78,
    size: '5.1MB',
    uploadDate: '2024-03-10',
    downloadCount: 892,
    description: '本标准规定了网络安全等级保护的基本要求，适用于网络安全等级保护工作的开展。',
  },
  {
    id: '3',
    title: 'ISO 9001:2015 质量管理体系要求',
    category: '国际标准',
    categorySlug: '国际标准',
    format: 'DOC',
    price: 10,
    isVip: true,
    pages: 52,
    size: '2.8MB',
    uploadDate: '2024-03-08',
    downloadCount: 2341,
    description: 'ISO 9001:2015 质量管理体系要求，适用于各种类型和规模的组织。',
  },
  {
    id: '4',
    title: '华为公司内部项目管理规范 V3.0',
    category: '企业标准',
    categorySlug: '企业标准',
    format: 'PPT',
    price: 15,
    isVip: true,
    pages: 36,
    size: '8.5MB',
    uploadDate: '2024-03-05',
    downloadCount: 567,
    description: '华为公司内部项目管理规范，包含项目全生命周期管理流程。',
  },
  {
    id: '5',
    title: '北京市建设工程施工现场安全管理标准',
    category: '地方标准',
    categorySlug: '地方标准',
    format: 'PDF',
    price: 0,
    isVip: false,
    pages: 32,
    size: '2.1MB',
    uploadDate: '2024-03-01',
    downloadCount: 445,
    description: '本标准适用于北京市建设工程施工现场的安全管理工作。',
  },
  {
    id: '6',
    title: '中国人工智能产业发展联盟技术标准',
    category: '团体标准',
    categorySlug: '团体标准',
    format: 'XLS',
    price: 8,
    isVip: false,
    pages: 15,
    size: '1.5MB',
    uploadDate: '2024-02-28',
    downloadCount: 334,
    description: '中国人工智能产业发展联盟发布的技术标准文件。',
  },
  {
    id: '7',
    title: '电力行业安全生产标准化规范',
    category: '行业标准',
    categorySlug: '行业标准',
    format: 'PDF',
    price: 3,
    isVip: false,
    pages: 56,
    size: '4.2MB',
    uploadDate: '2024-02-25',
    downloadCount: 678,
    description: '电力行业安全生产标准化规范，适用于电力生产企业。',
  },
  {
    id: '8',
    title: 'GB/T 19001-2016 质量管理体系要求',
    category: '国家标准',
    categorySlug: '国家标准',
    format: 'DOC',
    price: 0,
    isVip: false,
    pages: 48,
    size: '3.5MB',
    uploadDate: '2024-02-20',
    downloadCount: 1567,
    description: '等同采用 ISO 9001:2015 的国家标准。',
  },
  {
    id: '9',
    title: 'IEC 62368-1 音视频及信息技术设备安全',
    category: '国际标准',
    categorySlug: '国际标准',
    format: 'PDF',
    price: 20,
    isVip: true,
    pages: 120,
    size: '12.5MB',
    uploadDate: '2024-02-18',
    downloadCount: 234,
    description: 'IEC 62368-1 音视频及信息技术设备安全要求。',
  },
  {
    id: '10',
    title: '阿里巴巴集团数据安全管理办法',
    category: '企业标准',
    categorySlug: '企业标准',
    format: 'PDF',
    price: 12,
    isVip: true,
    pages: 28,
    size: '1.8MB',
    uploadDate: '2024-02-15',
    downloadCount: 890,
    description: '阿里巴巴集团内部数据安全管理规范。',
  },
  {
    id: '11',
    title: '上海市绿色建筑评价标准',
    category: '地方标准',
    categorySlug: '地方标准',
    format: 'PPT',
    price: 0,
    isVip: false,
    pages: 42,
    size: '6.8MB',
    uploadDate: '2024-02-10',
    downloadCount: 345,
    description: '上海市绿色建筑评价标准，适用于各类民用建筑。',
  },
  {
    id: '12',
    title: '中国通信标准化协会 5G 技术标准',
    category: '团体标准',
    categorySlug: '团体标准',
    format: 'PDF',
    price: 5,
    isVip: false,
    pages: 65,
    size: '5.5MB',
    uploadDate: '2024-02-08',
    downloadCount: 567,
    description: '中国通信标准化协会发布的 5G 技术相关标准。',
  },
  {
    id: '13',
    title: '石油化工行业环境保护技术规范',
    category: '行业标准',
    categorySlug: '行业标准',
    format: 'DOC',
    price: 6,
    isVip: false,
    pages: 38,
    size: '2.9MB',
    uploadDate: '2024-02-05',
    downloadCount: 456,
    description: '石油化工行业环境保护技术规范与要求。',
  },
  {
    id: '14',
    title: 'GB 50010-2010 混凝土结构设计规范',
    category: '国家标准',
    categorySlug: '国家标准',
    format: 'PDF',
    price: 8,
    isVip: false,
    pages: 156,
    size: '15.2MB',
    uploadDate: '2024-02-01',
    downloadCount: 2345,
    description: '混凝土结构设计规范，适用于各类混凝土结构设计。',
  },
  {
    id: '15',
    title: 'ISO 14001:2015 环境管理体系要求',
    category: '国际标准',
    categorySlug: '国际标准',
    format: 'PDF',
    price: 10,
    isVip: true,
    pages: 45,
    size: '3.8MB',
    uploadDate: '2024-01-28',
    downloadCount: 1234,
    description: 'ISO 14001:2015 环境管理体系要求及使用指南。',
  },
  {
    id: '16',
    title: '腾讯公司软件开发流程规范',
    category: '企业标准',
    categorySlug: '企业标准',
    format: 'DOC',
    price: 0,
    isVip: false,
    pages: 22,
    size: '1.2MB',
    uploadDate: '2024-01-25',
    downloadCount: 1890,
    description: '腾讯公司内部软件开发流程规范文档。',
  },
  {
    id: '17',
    title: '广东省建设工程计价依据',
    category: '地方标准',
    categorySlug: '地方标准',
    format: 'XLS',
    price: 15,
    isVip: true,
    pages: 88,
    size: '8.2MB',
    uploadDate: '2024-01-20',
    downloadCount: 678,
    description: '广东省建设工程计价依据和标准。',
  },
  {
    id: '18',
    title: '中国物流与采购联合会冷链物流标准',
    category: '团体标准',
    categorySlug: '团体标准',
    format: 'PDF',
    price: 0,
    isVip: false,
    pages: 35,
    size: '2.5MB',
    uploadDate: '2024-01-18',
    downloadCount: 234,
    description: '冷链物流行业技术标准和操作规范。',
  },
  {
    id: '19',
    title: '机械行业安全生产标准化评定标准',
    category: '行业标准',
    categorySlug: '行业标准',
    format: 'PDF',
    price: 4,
    isVip: false,
    pages: 42,
    size: '3.1MB',
    uploadDate: '2024-01-15',
    downloadCount: 567,
    description: '机械行业安全生产标准化评定标准和要求。',
  },
  {
    id: '20',
    title: 'GB/T 22239-2019 信息安全技术网络安全等级保护定级指南',
    category: '国家标准',
    categorySlug: '国家标准',
    format: 'PDF',
    price: 6,
    isVip: false,
    pages: 28,
    size: '2.0MB',
    uploadDate: '2024-01-10',
    downloadCount: 1456,
    description: '网络安全等级保护定级指南，帮助确定系统安全保护等级。',
  },
];

// 根据分类获取文档
export function getDocumentsByCategory(categorySlug: string): Document[] {
  return documents.filter((doc) => doc.categorySlug === categorySlug);
}

// 根据 ID 获取文档
export function getDocumentById(id: string): Document | undefined {
  return documents.find((doc) => doc.id === id);
}

// 搜索文档
export function searchDocuments(query: string): Document[] {
  const lowerQuery = query.toLowerCase();
  return documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery) ||
      doc.category.toLowerCase().includes(lowerQuery)
  );
}

// 获取热门文档（按下载量排序）
export function getPopularDocuments(limit: number = 10): Document[] {
  return [...documents].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, limit);
}

// 获取最新文档
export function getLatestDocuments(limit: number = 8): Document[] {
  return [...documents]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, limit);
}

// 获取相关推荐（同分类的其他文档）
export function getRelatedDocuments(docId: string, limit: number = 4): Document[] {
  const doc = getDocumentById(docId);
  if (!doc) return [];
  return documents
    .filter((d) => d.categorySlug === doc.categorySlug && d.id !== docId)
    .slice(0, limit);
}