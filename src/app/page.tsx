import Link from 'next/link';
import { getCategories, getLatestDocuments, getDocumentStats } from '@/lib/queries';

export const dynamic = 'force-dynamic';

// 分类对应的颜色
const categoryColors: Record<string, { bg: string; icon: string; arrow: string }> = {
  '行业标准': { bg: 'bg-emerald-100', icon: 'text-emerald-600', arrow: 'text-emerald-400' },
  '国家标准': { bg: 'bg-orange-100', icon: 'text-orange-600', arrow: 'text-orange-400' },
  '国际标准': { bg: 'bg-blue-100', icon: 'text-blue-600', arrow: 'text-blue-400' },
  '企业标准': { bg: 'bg-purple-100', icon: 'text-purple-600', arrow: 'text-purple-400' },
  '地方标准': { bg: 'bg-pink-100', icon: 'text-pink-600', arrow: 'text-pink-400' },
  '团体标准': { bg: 'bg-cyan-100', icon: 'text-cyan-600', arrow: 'text-cyan-400' },
};

// 格式对应的颜色
const formatColors: Record<string, { bg: string; text: string; icon: string }> = {
  PDF: { bg: 'bg-red-50', text: 'text-red-600', icon: '📄' },
  DOC: { bg: 'bg-blue-50', text: 'text-blue-600', icon: '📝' },
  PPT: { bg: 'bg-orange-50', text: 'text-orange-600', icon: '📊' },
  XLS: { bg: 'bg-green-50', text: 'text-green-600', icon: '📈' },
};

const hotSearches = ['质量管理', '环境管理', '信息安全', '职业健康', 'ISO9001', 'ISO14001'];

export default async function Home() {
  const categories = await getCategories();
  const latestDocs = await getLatestDocuments(6);
  const stats = await getDocumentStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[480px]">
        {/* 背景图 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-bg.png)' }}
        />
        {/* 渐变遮罩（让左侧文字更清晰） */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
          <div className="max-w-xl">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full mb-6 border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-700 font-medium">全球标准 · 权威专业 · 智能检索</span>
            </div>

            {/* 标题 */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="text-gray-900">标准</span>
              <span className="text-gradient">文库</span>
            </h1>
            <p className="text-xl text-gray-700 font-medium mb-2">专业标准文档分享平台</p>
            <p className="text-gray-500 mb-8">汇聚全球权威标准，助力企业合规发展与创新</p>

            {/* 搜索框 */}
            <form action="/search" method="GET" className="mb-5">
              <div className="flex items-center bg-white rounded-full shadow-lg shadow-emerald-100/50 overflow-hidden border border-gray-100 p-1.5 max-w-lg">
                <div className="flex-1 flex items-center px-4">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    name="q"
                    placeholder="搜索行业标准、国家标准、国际标准..."
                    className="flex-1 py-3 text-gray-700 focus:outline-none bg-transparent placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* 热门搜索 */}
            <div className="flex items-center flex-wrap gap-2 mb-8">
              <span className="text-sm text-gray-400">热门搜索：</span>
              {hotSearches.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 text-sm text-emerald-600 bg-white/80 hover:bg-emerald-50 rounded-full transition-colors duration-200 border border-emerald-100"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: '📚', value: stats.totalDocs.toLocaleString(), label: '标准文档' },
                { icon: '📁', value: stats.totalCategories.toLocaleString(), label: '文档分类' },
                { icon: '👥', value: stats.totalUsers.toLocaleString(), label: '注册用户' },
                { icon: '⬇️', value: stats.totalDownloads.toLocaleString(), label: '累计下载' },
              ].map((stat) => (
                <div key={stat.label} className="text-center bg-white/70 backdrop-blur rounded-xl py-3 px-2">
                  <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 主内容 + 侧边栏 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* 左侧主内容 */}
          <div className="flex-1 min-w-0">
            {/* 文档分类 */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-5 bg-emerald-500 rounded-full" />
                    文档分类
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 ml-3">覆盖各行业标准体系</p>
                </div>
                <Link href="/category/行业标准" className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 text-sm font-medium">
                  查看全部分类 →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => {
                  const colors = categoryColors[category.name] || { bg: 'bg-gray-100', icon: 'text-gray-600', arrow: 'text-gray-400' };
                  return (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="bg-white rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <span className={`text-xl ${colors.icon}`}>{category.icon}</span>
                        </div>
                        <svg className={`w-4 h-4 ${colors.arrow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-700 text-sm">{category.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{category.count}份文档</p>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* 最新文档 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-5 bg-emerald-500 rounded-full" />
                    最新文档
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 ml-3">实时更新 · 权威发布</p>
                </div>
                <Link href="/category/行业标准" className="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 text-sm font-medium">
                  查看全部 →
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {latestDocs.map((doc, index) => {
                  const fmt = formatColors[doc.format] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: '📄' };
                  return (
                    <Link
                      key={doc.id}
                      href={`/doc/${doc.id}`}
                      className={`flex items-center px-6 py-5 hover:bg-gray-50 transition-colors duration-200 ${
                        index !== latestDocs.length - 1 ? 'border-b border-gray-50' : ''
                      }`}
                    >
                      {/* 格式图标 */}
                      <div className={`w-12 h-12 ${fmt.bg} rounded-xl flex items-center justify-center flex-shrink-0 mr-4`}>
                        <span className="text-2xl">{fmt.icon}</span>
                      </div>
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-800 text-sm truncate hover:text-emerald-600 transition-colors duration-200">
                            {doc.title}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs font-medium ${fmt.bg} ${fmt.text} rounded flex-shrink-0`}>
                            {doc.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{doc.description || '专业标准文档，权威发布'}</p>
                      </div>
                      {/* 日期和按钮 */}
                      <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                        <span className="text-xs text-gray-400">{doc.uploadDate}</span>
                        <span className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors duration-200">
                          查看详情
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          {/* 右侧边栏 */}
          <aside className="hidden xl:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* 平台优势 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">平台优势</h3>
                <div className="space-y-4">
                  {[
                    { icon: '🛡️', title: '权威可靠', desc: '全球权威标准机构合作' },
                    { icon: '🔍', title: '智能检索', desc: 'AI驱动的智能搜索技术' },
                    { icon: '🔄', title: '实时更新', desc: '标准动态实时更新推送' },
                    { icon: '📄', title: '多格式支持', desc: 'PDF、Word、在线预览' },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 今日数据 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">平台数据</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">总下载量</p>
                    <p className="text-xl font-bold text-gray-800">{stats.totalDownloads.toLocaleString()} <span className="text-xs font-normal text-gray-400">次</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">有下载的文档</p>
                    <p className="text-xl font-bold text-gray-800">{stats.todayUpdates} <span className="text-xs font-normal text-gray-400">份</span></p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">文档总数</p>
                    <p className="text-xl font-bold text-gray-800">{stats.totalDocs} <span className="text-xs font-normal text-gray-400">份</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">注册用户</p>
                    <p className="text-xl font-bold text-gray-800">{stats.totalUsers} <span className="text-xs font-normal text-gray-400">人</span></p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
