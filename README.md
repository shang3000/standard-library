# 标准文库 - 专业标准文档分享平台

一个基于 Next.js 16 构建的标准文档分享网站，提供行业标准、国家标准、国际标准等各类标准文档的查阅与下载服务。

## ✨ 功能特性

### 前台功能
- 📚 文档浏览 - 按分类浏览标准文档
- 🔍 搜索功能 - 支持文档标题、描述搜索
- 🏷️ 分类筛选 - 按格式、VIP状态、排序方式筛选
- 📄 文档详情 - 查看文档详细信息
- ⬇️ 下载系统 - 星币下载、VIP免费下载
- 👤 用户系统 - 注册、登录、个人中心
- ⭐ 星币系统 - 注册赠送星币，下载扣费
- 👑 VIP会员 - VIP专享文档、免费下载付费文档

### 后台管理
- 🔐 密码保护 - 环境变量配置管理密码
- 📋 文档管理 - 查看、删除文档
- ➕ 添加文档 - 新增标准文档
- 👥 用户管理 - 查看用户列表

## 🛠️ 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **数据库**: SQLite (sql.js - 纯JS实现，无需编译)
- **认证**: JWT (jose) + httpOnly Cookie
- **密码**: bcryptjs 加密

## 🚀 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，填入你的配置：

```bash
cp .env.example .env.local
```

环境变量说明：
- `JWT_SECRET` - JWT 加密密钥（请使用随机强密码）
- `ADMIN_PASSWORD` - 后台管理密码

### 3. 初始化数据库

```bash
npm run db:init
```

这会创建数据库表结构并插入测试数据，包括：
- 6个文档分类
- 50+ 测试文档
- 2个测试用户：
  - 普通用户：`test` / `123456`（100星币）
  - VIP用户：`vipuser` / `123456`（500星币）

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

## 📦 项目结构

```
standard-library/
├── src/
│   ├── app/
│   │   ├── about/           # 关于我们页面
│   │   ├── admin/           # 后台管理页面
│   │   ├── api/             # API 路由
│   │   │   ├── admin/       # 后台管理 API
│   │   │   ├── auth/        # 认证 API（登录/注册/退出）
│   │   │   ├── download/    # 下载 API
│   │   │   └── profile/     # 用户信息 API
│   │   ├── category/        # 分类页面
│   │   ├── doc/             # 文档详情页面
│   │   ├── login/           # 登录页面
│   │   ├── register/        # 注册页面
│   │   ├── profile/         # 个人中心
│   │   └── search/          # 搜索页面
│   ├── components/          # React 组件
│   ├── lib/                 # 工具库
│   │   ├── auth.ts          # 认证工具
│   │   ├── db.ts            # 数据库连接
│   │   ├── queries.ts       # 数据库查询
│   │   ├── schema.ts        # 数据库结构
│   │   └── seed.ts          # 种子数据
│   └── types/               # TypeScript 类型定义
├── data/                    # SQLite 数据库文件
├── public/                  # 静态资源
│   └── images/              # 背景图片
├── .env.example             # 环境变量示例
├── .env.local               # 环境变量（不提交到Git）
└── package.json
```

## 🌐 部署

### Vercel 一键部署

1. Fork 本项目到你的 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `JWT_SECRET` - 你的JWT密钥
   - `ADMIN_PASSWORD` - 管理员密码
4. 点击部署

**注意**: Vercel 使用 Serverless 环境，SQLite 数据库会在每次冷启动后重置。生产环境建议使用持久化数据库（如 PlanetScale、Turso 等）。

### 腾讯云手动部署

#### 1. 服务器准备

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2
```

#### 2. 上传项目

```bash
# 克隆项目
git clone <your-repo-url>
cd standard-library

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入真实值

# 初始化数据库
npm run db:init

# 构建项目
npm run build
```

#### 3. 启动服务

```bash
# 使用 PM2 启动
pm2 start npm --name "standard-library" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

#### 4. Nginx 配置（可选）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📝 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `JWT_SECRET` | JWT 加密密钥 | `standard-library-secret-key-2024` |
| `ADMIN_PASSWORD` | 后台管理密码 | `admin123` |

## 🧪 测试账号

| 用户名 | 密码 | 类型 | 星币 |
|--------|------|------|------|
| `test` | `123456` | 普通用户 | 100 |
| `vipuser` | `123456` | VIP用户 | 500 |

## 📄 License

MIT

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [sql.js](https://sql.js.org/)
