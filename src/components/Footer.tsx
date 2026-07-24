import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold">标准文库</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              标准文库是一个专业的标准文档分享平台，提供行业标准、国家标准、国际标准等各类标准文档的查阅与下载服务。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/category/行业标准" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  行业标准
                </Link>
              </li>
              <li>
                <Link href="/category/国家标准" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  国家标准
                </Link>
              </li>
              <li>
                <Link href="/category/国际标准" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                  国际标准
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>📧 contact@standard-library.com</li>
              <li>📞 400-123-4567</li>
              <li>📍 北京市海淀区中关村大街1号</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 标准文库. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}