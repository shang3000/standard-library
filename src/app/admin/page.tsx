'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface Document {
  id: number;
  title: string;
  category: string;
  format: string;
  pages: number;
  fileSize: string;
  priceStars: number;
  downloadCount: number;
  isVip: boolean;
  description: string;
  hasFile: boolean;
  uploadTime: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  starsBalance: number;
  createdAt: string;
}

interface Overview {
  summary: { documentCount: number; fileCount: number; userCount: number; vipUserCount: number; downloadCount: number };
  activity: { date: string; downloads: number }[];
  topDocuments: { id: number; title: string; downloadCount: number; isVip: boolean; category: { name: string } }[];
  categories: { name: string; documentCount: number }[];
}

export default function AdminPage() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'documents' | 'add-doc' | 'users'>('dashboard');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [documentQuery, setDocumentQuery] = useState('');
  const [documentScope, setDocumentScope] = useState<'all' | 'ready' | 'missing'>('all');

  // 添加文档表单
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: '行业标准',
    format: 'PDF',
    pages: 0,
    fileSize: '',
    priceStars: 0,
    description: '',
    isVip: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const filteredDocuments = documents.filter((doc) => {
    const matchQuery = `${doc.title} ${doc.category} ${doc.format}`.toLowerCase().includes(documentQuery.toLowerCase().trim());
    const matchScope = documentScope === 'all' || (documentScope === 'ready' && doc.hasFile) || (documentScope === 'missing' && !doc.hasFile);
    return matchQuery && matchScope;
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
      fetchUsers();
      fetchOverview();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_auth', 'true');
      } else {
        setAuthError(t('admin.passwordError'));
      }
    } catch {
      setAuthError(t('admin.verifyFailed'));
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents);
      }
    } catch {
      console.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch {
      console.error('Failed to fetch users');
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/admin/overview');
      if (response.ok) setOverview(await response.json());
    } catch {
      console.error('Failed to fetch overview');
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm(t('admin.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('admin.deleted') });
        fetchDocuments();
      } else {
        setMessage({ type: 'error', text: t('admin.deleteFailed') });
      }
    } catch {
      setMessage({ type: 'error', text: t('admin.deleteRetry') });
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!selectedFile) {
        setMessage({ type: 'error', text: '请选择要上传的文件' });
        return;
      }
      const formData = new FormData();
      Object.entries(newDoc).forEach(([key, value]) => formData.append(key, String(value)));
      formData.append('file', selectedFile);
      const response = await fetch('/api/admin/documents', { method: 'POST', body: formData });

      if (response.ok) {
        setMessage({ type: 'success', text: t('admin.addSuccess') });
        setNewDoc({
          title: '',
          category: '行业标准',
          format: 'PDF',
          pages: 0,
          fileSize: '',
          priceStars: 0,
          description: '',
          isVip: false,
        });
        setSelectedFile(null);
        fetchDocuments();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || t('admin.addFailed') });
      }
    } catch {
      setMessage({ type: 'error', text: t('admin.addFailedRetry') });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocument) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(editingDocument).forEach(([key, value]) => formData.append(key, String(value)));
      if (replacementFile) formData.append('file', replacementFile);
      const response = await fetch(`/api/admin/documents/${editingDocument.id}`, { method: 'PATCH', body: formData });
      if (!response.ok) throw new Error((await response.json()).error || '更新失败');
      setMessage({ type: 'success', text: '文档已更新' });
      setEditingDocument(null);
      setReplacementFile(null);
      fetchDocuments();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : '更新失败' });
    } finally {
      setLoading(false);
    }
  };

  // 检查是否已认证
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 登录页面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f9fd] flex items-center justify-center relative">
        <div className="absolute top-20 left-20 w-40 h-40 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-100/50 rounded-full blur-3xl" />

        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white shadow-xl p-8 relative z-10 animate-fade-in-up">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🔐</span>
            <h1 className="text-2xl font-bold text-gray-800">{t('admin.title')}</h1>
            <p className="text-gray-400 mt-2">{t('admin.passwordPlaceholder')}</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50/80 backdrop-blur border border-red-200/50 rounded-xl text-red-600 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                {t('admin.passwordLabel')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder={t('admin.passwordPlaceholder')}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#17324d] hover:bg-[#254c70] text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('admin.loginButton')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 主管理界面
  return (
    <div className="min-h-screen bg-[#f5f9fd]">
      {/* 顶部导航 */}
      <div className="border-b border-slate-200 bg-[#f8fbff]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#17324d] text-sm font-black text-white">SL</span>
              <div><p className="text-[11px] font-semibold tracking-[0.18em] text-sky-700">STANDARD LIBRARY</p><span className="text-lg font-bold text-slate-800">资料运营台</span></div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-slate-500 hover:text-sky-800 transition-colors duration-200 text-sm">
                {t('admin.backToFront')}
              </a>
              <button
                onClick={() => {
                  sessionStorage.removeItem('admin_auth');
                  setIsAuthenticated(false);
                }}
                className="text-red-400 hover:text-red-600 transition-colors duration-200 text-sm"
              >
                {t('admin.exit')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 消息提示 */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div
            className={`p-4 rounded-2xl ${
              message.type === 'success'
                ? 'glass text-emerald-600 border border-emerald-200/50'
                : 'bg-red-50/80 backdrop-blur text-red-600 border border-red-200/50'
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {/* 标签页导航 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white/80 px-3 shadow-sm">
          <nav className="flex gap-1 overflow-x-auto">
            {[
              { key: 'dashboard' as const, icon: '▦', label: '运营概览' },
              { key: 'documents' as const, icon: '📄', label: t('admin.docManagement') },
              { key: 'add-doc' as const, icon: '➕', label: t('admin.addDoc') },
              { key: 'users' as const, icon: '👥', label: t('admin.userManagement') },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`my-2 whitespace-nowrap rounded-xl px-4 py-2.5 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-[#17324d] text-white shadow-md shadow-slate-300'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <section className="space-y-6 animate-fade-in">
            <div className="overflow-hidden rounded-3xl bg-[#17324d] px-6 py-7 text-white shadow-xl shadow-slate-300 sm:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-xs font-semibold tracking-[0.18em] text-sky-200">LIBRARY PULSE / 实时概览</p><h1 className="mt-2 text-3xl font-bold tracking-tight">资料正在被妥善管理</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">从上传、权限校验到受控下载，每一次流转都留在系统记录中。</p></div>
                <button onClick={() => setActiveTab('add-doc')} className="rounded-xl bg-[#9de7dc] px-4 py-3 text-sm font-bold text-[#17324d] transition hover:bg-white">+ 上传一份资料</button>
              </div>
              <div className="mt-7 grid grid-cols-3 divide-x divide-slate-500/50 border-t border-slate-500/50 pt-4 text-sm"><div><p className="text-slate-300">可下载资料</p><p className="mt-1 text-2xl font-bold">{overview?.summary.fileCount ?? '—'}</p></div><div className="pl-5"><p className="text-slate-300">累计受控下载</p><p className="mt-1 text-2xl font-bold">{overview?.summary.downloadCount ?? '—'}</p></div><div className="pl-5"><p className="text-slate-300">VIP 用户</p><p className="mt-1 text-2xl font-bold">{overview?.summary.vipUserCount ?? '—'}</p></div></div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[['资料总量', overview?.summary.documentCount, 'DOCS', 'bg-sky-50 text-sky-700'], ['已关联文件', overview?.summary.fileCount, 'FILES', 'bg-emerald-50 text-emerald-700'], ['注册用户', overview?.summary.userCount, 'USERS', 'bg-violet-50 text-violet-700'], ['文件完整率', overview ? `${Math.round((overview.summary.fileCount / Math.max(overview.summary.documentCount, 1)) * 100)}%` : '—', 'HEALTH', 'bg-amber-50 text-amber-700']].map(([label, value, code, color]) => <div key={String(code)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold tracking-wider text-slate-400">{code}</p><p className="mt-4 text-sm font-medium text-slate-600">{label}</p><p className="mt-1 text-3xl font-bold text-slate-800">{value ?? '—'}</p><span className={`mt-4 inline-block rounded-full px-2 py-1 text-xs font-medium ${color}`}>数据库实时统计</span></div>)}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-baseline justify-between"><div><p className="text-xs font-semibold tracking-wider text-sky-700">ACTIVITY</p><h2 className="mt-1 text-lg font-bold text-slate-800">近 7 日下载趋势</h2></div><span className="text-xs text-slate-400">真实下载记录</span></div><div className="mt-7 flex h-44 items-end gap-2">{(overview?.activity ?? Array.from({ length: 7 }, (_, index) => ({ date: String(index), downloads: 0 }))).map((item) => { const max = Math.max(...(overview?.activity ?? []).map((row) => row.downloads), 1); const height = Math.max(10, (item.downloads / max) * 100); return <div key={item.date} className="flex h-full flex-1 flex-col justify-end"><div title={`${item.downloads} 次下载`} style={{ height: `${height}%` }} className="min-h-2 rounded-t-lg bg-gradient-to-t from-[#1f6f8b] to-[#9de7dc] transition-all duration-500" /><p className="mt-2 text-center text-[10px] text-slate-400">{item.date.slice(5)}</p></div>; })}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-[#eef7ff] p-6 shadow-sm"><p className="text-xs font-semibold tracking-wider text-sky-700">CATALOG HEALTH</p><h2 className="mt-1 text-lg font-bold text-slate-800">资料归档分布</h2><div className="mt-6 space-y-4">{(overview?.categories ?? []).map((category) => <div key={category.name}><div className="flex justify-between text-sm"><span className="text-slate-600">{category.name}</span><span className="font-semibold text-slate-700">{category.documentCount}</span></div><div className="mt-2 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-[#1f6f8b]" style={{ width: `${Math.min(100, (category.documentCount / Math.max(...(overview?.categories ?? []).map((item) => item.documentCount), 1)) * 100)}%` }} /></div></div>)}{overview?.categories.length === 0 && <p className="py-8 text-sm text-slate-400">暂无分类数据</p>}</div></div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><p className="text-xs font-semibold tracking-wider text-sky-700">TOP CONTENT</p><h2 className="mt-1 text-lg font-bold text-slate-800">最受关注的资料</h2></div><button onClick={() => setActiveTab('documents')} className="text-sm font-medium text-sky-700 hover:text-sky-900">查看全部资料 →</button></div><div className="divide-y divide-slate-100">{(overview?.topDocuments ?? []).map((doc, index) => <div key={doc.id} className="flex items-center gap-4 px-6 py-4"><span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-sm font-bold text-slate-500">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-700">{doc.title}</p><p className="mt-1 text-xs text-slate-400">{doc.category.name}{doc.isVip ? ' · VIP 专享' : ''}</p></div><span className="text-sm font-semibold text-slate-700">{doc.downloadCount} <span className="text-xs font-normal text-slate-400">次下载</span></span></div>)}{overview?.topDocuments.length === 0 && <p className="px-6 py-10 text-sm text-slate-400">资料上传后，这里会展示真实的热门资料。</p>}</div></div>
          </section>
        )}
        {/* 文档列表 */}
        {activeTab === 'documents' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-semibold tracking-wider text-sky-700">CATALOG</p><h2 className="mt-1 text-lg font-bold text-slate-800">资料目录 <span className="text-sm font-normal text-slate-400">共 {documents.length} 份</span></h2></div><button onClick={() => setActiveTab('add-doc')} className="rounded-xl bg-[#17324d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#254c70]">+ 新增资料</button></div>
              <div className="mt-5 flex flex-col gap-3 md:flex-row"><label className="relative flex-1"><span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">⌕</span><input value={documentQuery} onChange={(event) => setDocumentQuery(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white" placeholder="按标题、分类或文件类型查找" /></label><div className="flex rounded-xl bg-slate-100 p-1">{([['all', '全部'], ['ready', '已归档'], ['missing', '待补文件']] as const).map(([scope, label]) => <button key={scope} onClick={() => setDocumentScope(scope)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${documentScope === scope ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{label}</button>)}</div></div>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">{t('admin.loading')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr className="bg-slate-50/80"><th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-400">资料</th><th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-400">分类</th><th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-400">格式</th><th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-400">获取方式</th><th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-400">下载</th><th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-slate-400">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="transition-colors duration-200 hover:bg-sky-50/50">
                        <td className="px-6 py-4"><div className="flex items-center">
                          <div className="flex items-center">
                            {doc.isVip && (
                              <span className="mr-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full">
                                VIP
                              </span>
                            )}
                            <span className="text-sm font-semibold text-slate-700">
                              {doc.title}
                            </span>
                            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${doc.hasFile ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {doc.hasFile ? '已上传文件' : '缺少文件'}
                            </span>
                          </div><p className="mt-1 text-xs text-slate-400">ID #{doc.id} · {doc.fileSize || '文件大小待补充'}</p></div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {doc.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
                            {doc.format}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {doc.priceStars === 0 ? (
                            <span className="font-medium text-emerald-600">{t('admin.free')}</span>
                          ) : (
                            <span>⭐ {doc.priceStars}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                          {doc.downloadCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => { setEditingDocument(doc); setReplacementFile(null); }} className="mr-3 text-sky-700 hover:text-sky-900 transition-colors duration-200">
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-400 hover:text-red-600 transition-colors duration-200"
                          >
                            {t('admin.table.delete')}
                          </button>
                        </td>
                      </tr>
                    ))}{filteredDocuments.length === 0 && <tr><td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-400">没有匹配的资料，试试清空搜索或切换筛选条件。</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 添加文档 */}
        {activeTab === 'add-doc' && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-[#eef7ff] px-6 py-6"><p className="text-xs font-semibold tracking-wider text-sky-700">NEW RECORD</p><h2 className="mt-1 text-xl font-bold text-slate-800">将一份资料归入资料库</h2><p className="mt-2 text-sm text-slate-500">先上传原始文件，再补全检索信息与访问规则。系统会自动校验格式和 20MB 大小限制。</p><div className="mt-5 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-600 shadow-sm">01 上传原件</span><span className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-600 shadow-sm">02 填写资料信息</span><span className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-600 shadow-sm">03 设置访问权限</span></div></div>
            <div className="p-6">
            <form onSubmit={handleAddDocument} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    {t('admin.addForm.titleLabel')} *
                  </label>
                  <input
                    type="text"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                    placeholder={t('admin.addForm.titlePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    {t('admin.addForm.categoryLabel')}
                  </label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200"
                  >
                    <option value="行业标准">{t('categories.industry')}</option>
                    <option value="国家标准">{t('categories.national')}</option>
                    <option value="国际标准">{t('categories.international')}</option>
                    <option value="企业标准">{t('categories.enterprise')}</option>
                    <option value="地方标准">{t('categories.local')}</option>
                    <option value="团体标准">{t('categories.group')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    {t('admin.addForm.formatLabel')}
                  </label>
                  <select
                    value={newDoc.format}
                    onChange={(e) => setNewDoc({ ...newDoc, format: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOC">DOC</option>
                    <option value="XLS">XLS</option>
                    <option value="PPT">PPT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    {t('admin.addForm.pagesLabel')}
                  </label>
                  <input
                    type="number"
                    value={newDoc.pages}
                    onChange={(e) => setNewDoc({ ...newDoc, pages: Number(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="document-file" className="block text-sm font-medium text-gray-600 mb-1.5">上传文件 *</label>
                  <input
                    id="document-file"
                    type="file"
                    required
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                  <label htmlFor="document-file" className={`flex cursor-pointer items-center justify-between rounded-2xl border border-dashed px-5 py-4 transition ${selectedFile ? 'border-emerald-300 bg-emerald-50' : 'border-sky-300 bg-sky-50 hover:border-sky-500 hover:bg-sky-100/70'}`}><div><p className="font-medium text-slate-700">{selectedFile ? selectedFile.name : '选择一份要归档的文件'}</p><p className="mt-1 text-xs text-slate-500">支持 PDF、Word、Excel、PPT，单个文件不超过 20MB</p></div><span className={`rounded-lg px-3 py-2 text-xs font-bold ${selectedFile ? 'bg-emerald-600 text-white' : 'bg-[#17324d] text-white'}`}>{selectedFile ? '文件已就绪' : '选择文件'}</span></label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    {t('admin.addForm.priceLabel')}
                  </label>
                  <input
                    type="number"
                    value={newDoc.priceStars}
                    onChange={(e) => setNewDoc({ ...newDoc, priceStars: Number(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  {t('admin.addForm.descLabel')}
                </label>
                <textarea
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                  placeholder={t('admin.addForm.descPlaceholder')}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVip"
                  checked={newDoc.isVip}
                  onChange={(e) => setNewDoc({ ...newDoc, isVip: e.target.checked })}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isVip" className="ml-2 block text-sm text-gray-600">
                  {t('admin.addForm.vipOnly')}
                </label>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-5"><p className="text-xs text-slate-400">提交后，文件会保存到私有存储并建立数据库记录。</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#17324d] hover:bg-[#254c70] text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? t('admin.addForm.submitting') : t('admin.addForm.submitButton')}
                </button>
              </div>
            </form>
            </div>
          </div>
        )}

        {/* 用户列表 */}
        {activeTab === 'users' && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="px-6 py-4 border-b border-white/30">
              <h2 className="text-lg font-semibold text-gray-700">
                {t('admin.userList')} ({users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.table.id')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.userTable.username')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.userTable.email')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.userTable.vip')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.userTable.starCoins')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('admin.userTable.registerTime')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/20 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isVip ? (
                          <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full">
                            VIP
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">{t('admin.userTable.normal')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ⭐ {user.starsBalance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {editingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/35 p-4">
          <form onSubmit={handleUpdateDocument} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800">编辑文档</h2><button type="button" onClick={() => setEditingDocument(null)} className="text-gray-400 hover:text-gray-700">关闭</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required value={editingDocument.title} onChange={(e) => setEditingDocument({ ...editingDocument, title: e.target.value })} className="rounded-xl border border-gray-200 px-3 py-2" placeholder="文档标题" />
              <select value={editingDocument.category} onChange={(e) => setEditingDocument({ ...editingDocument, category: e.target.value })} className="rounded-xl border border-gray-200 px-3 py-2"><option value="行业标准">行业标准</option><option value="国家标准">国家标准</option><option value="国际标准">国际标准</option><option value="企业标准">企业标准</option><option value="地方标准">地方标准</option><option value="团体标准">团体标准</option></select>
              <select value={editingDocument.format} onChange={(e) => setEditingDocument({ ...editingDocument, format: e.target.value })} className="rounded-xl border border-gray-200 px-3 py-2"><option>PDF</option><option>DOC</option><option>XLS</option><option>PPT</option></select>
              <input type="number" min="0" value={editingDocument.pages} onChange={(e) => setEditingDocument({ ...editingDocument, pages: Number(e.target.value) })} className="rounded-xl border border-gray-200 px-3 py-2" placeholder="页数" />
              <input type="number" min="0" value={editingDocument.priceStars} onChange={(e) => setEditingDocument({ ...editingDocument, priceStars: Number(e.target.value) })} className="rounded-xl border border-gray-200 px-3 py-2" placeholder="星币价格" />
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(e) => setReplacementFile(e.target.files?.[0] ?? null)} className="rounded-xl border border-gray-200 px-3 py-2" />
            </div>
            <textarea value={editingDocument.description} onChange={(e) => setEditingDocument({ ...editingDocument, description: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2" rows={4} placeholder="文档描述" />
            <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={editingDocument.isVip} onChange={(e) => setEditingDocument({ ...editingDocument, isVip: e.target.checked })} /> VIP 专享</label>
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditingDocument(null)} className="rounded-xl px-4 py-2 text-gray-600">取消</button><button disabled={loading} className="rounded-xl bg-[#17324d] px-5 py-2 text-white disabled:opacity-50">保存修改</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
