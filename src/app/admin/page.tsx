'use client';

import { useState, useEffect } from 'react';

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'documents' | 'add-doc' | 'users'>('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
      fetchUsers();
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
        setAuthError('密码错误');
      }
    } catch {
      setAuthError('验证失败，请重试');
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

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('确定要删除这个文档吗？')) return;

    try {
      const response = await fetch(`/api/admin/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '文档已删除' });
        fetchDocuments();
      } else {
        setMessage({ type: 'error', text: '删除失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '删除失败，请重试' });
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDoc),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '文档添加成功' });
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
        fetchDocuments();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || '添加失败' });
      }
    } catch {
      setMessage({ type: 'error', text: '添加失败，请重试' });
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
      <div className="min-h-screen mesh-bg flex items-center justify-center relative">
        <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-green-200/20 rounded-full blur-3xl" />

        <div className="max-w-md w-full glass-strong rounded-3xl shadow-xl p-8 relative z-10 animate-fade-in-up">
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">🔐</span>
            <h1 className="text-2xl font-bold text-gray-800">后台管理</h1>
            <p className="text-gray-400 mt-2">请输入管理员密码</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50/80 backdrop-blur border border-red-200/50 rounded-xl text-red-600 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                管理密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                placeholder="请输入管理员密码"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 btn-sheen bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 主管理界面
  return (
    <div className="min-h-screen mesh-bg">
      {/* 顶部导航 */}
      <div className="glass-strong shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚙️</span>
              <span className="text-xl font-bold text-gradient">后台管理</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-500 hover:text-primary-dark transition-colors duration-200 text-sm">
                返回前台
              </a>
              <button
                onClick={() => {
                  sessionStorage.removeItem('admin_auth');
                  setIsAuthenticated(false);
                }}
                className="text-red-400 hover:text-red-600 transition-colors duration-200 text-sm"
              >
                退出
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
        <div className="border-b border-white/30">
          <nav className="-mb-px flex space-x-4">
            {[
              { key: 'documents' as const, icon: '📄', label: '文档管理' },
              { key: 'add-doc' as const, icon: '➕', label: '添加文档' },
              { key: 'users' as const, icon: '👥', label: '用户管理' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
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
        {/* 文档列表 */}
        {activeTab === 'documents' && (
          <div className="glass-strong rounded-2xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-white/30">
              <h2 className="text-lg font-semibold text-gray-700">
                文档列表 ({documents.length})
              </h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">加载中...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        标题
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        分类
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        格式
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        价格
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        下载
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/20 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {doc.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {doc.isVip && (
                              <span className="mr-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full">
                                VIP
                              </span>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {doc.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary-dark rounded-full">
                            {doc.format}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.priceStars === 0 ? (
                            <span className="text-emerald-500 font-medium">免费</span>
                          ) : (
                            <span>⭐ {doc.priceStars}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.downloadCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-400 hover:text-red-600 transition-colors duration-200"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 添加文档 */}
        {activeTab === 'add-doc' && (
          <div className="glass-strong rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">添加新文档</h2>
            <form onSubmit={handleAddDocument} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    文档标题 *
                  </label>
                  <input
                    type="text"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                    placeholder="输入文档标题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    分类
                  </label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200"
                  >
                    <option value="行业标准">行业标准</option>
                    <option value="国家标准">国家标准</option>
                    <option value="国际标准">国际标准</option>
                    <option value="企业标准">企业标准</option>
                    <option value="地方标准">地方标准</option>
                    <option value="团体标准">团体标准</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    格式
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
                    页数
                  </label>
                  <input
                    type="number"
                    value={newDoc.pages}
                    onChange={(e) => setNewDoc({ ...newDoc, pages: Number(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    文件大小
                  </label>
                  <input
                    type="text"
                    value={newDoc.fileSize}
                    onChange={(e) => setNewDoc({ ...newDoc, fileSize: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                    placeholder="例如: 3.5MB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    价格（星币）
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
                  描述
                </label>
                <textarea
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/50 border border-gray-200/60 rounded-xl focus:outline-none input-glow transition-all duration-200 placeholder-gray-400"
                  placeholder="输入文档描述"
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
                  VIP 专享文档
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 btn-sheen bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? '添加中...' : '添加文档'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 用户列表 */}
        {activeTab === 'users' && (
          <div className="glass-strong rounded-2xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-white/30">
              <h2 className="text-lg font-semibold text-gray-700">
                用户列表 ({users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      用户名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      邮箱
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      VIP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      星币
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      注册时间
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
                          <span className="text-sm text-gray-400">普通</span>
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
    </div>
  );
}
