import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[220px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-emerald-600 transition-colors duration-200">首页</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600">关于我们</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-800">关于我们</h1>
          <p className="text-gray-500 mt-1 text-sm">了解标准文库，专业标准文档分享平台</p>
        </div>
      </section>

      {/* 白色内容区域 */}
      <div className="bg-white rounded-t-[40px] -mt-6 relative z-10 pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 平台介绍 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">平台介绍</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              标准文库是一个专业的标准文档分享平台，致力于为工程师、研究人员、企业技术人员提供便捷的标准文档查阅与下载服务。
            </p>
            <p className="text-gray-600 leading-relaxed">
              我们收录了国家标准、行业标准、国际标准、企业标准、地方标准、团体标准等多种类型的标准文档，覆盖各行各业各领域的技术规范与要求。
            </p>
          </div>

          {/* 核心优势 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">核心优势</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">权威可靠</h3>
                <p className="text-gray-600 text-sm">所有文档均来自官方渠道，确保内容准确、权威、最新</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">高效便捷</h3>
                <p className="text-gray-600 text-sm">快速搜索、在线预览、一键下载，让标准文档触手可及</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">分类齐全</h3>
                <p className="text-gray-600 text-sm">涵盖国标、行标、地标、团标等多种标准类型，满足不同需求</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">社区共享</h3>
                <p className="text-gray-600 text-sm">用户可上传分享标准文档，共建标准知识库</p>
              </div>
            </div>
          </div>

          {/* 联系方式 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">联系我们</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              如果您有任何建议、合作意向或问题反馈，欢迎通过以下方式联系我们：
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">邮箱：contact@standard-library.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">地址：中国 · 大连</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
