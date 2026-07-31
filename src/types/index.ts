// 文档格式类型
export type DocFormat = 'PDF' | 'DOC' | 'PPT' | 'XLS';

// 分类类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
}

// 文档类型
export interface Document {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  categoryId?: string;
  format: DocFormat;
  price: number; // 0 表示免费
  isVip: boolean;
  pages: number;
  size: string; // 如 "2.5MB"
  uploadDate: string;
  downloadCount: number;
  description: string;
  coverImage?: string;
}

// 搜索参数类型
export interface SearchParams {
  q?: string;
  category?: string;
  format?: DocFormat;
  page?: string;
}

// 筛选参数类型
export interface FilterParams {
  formats?: DocFormat[];
  isFree?: boolean;
  isVip?: boolean;
  sort?: 'latest' | 'popular' | 'price-asc' | 'price-desc';
}
