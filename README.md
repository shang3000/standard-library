# 标准文库

面向标准与合规资料管理的全栈文档平台。项目围绕“管理员维护文档、用户按权限获取资料、系统可追溯下载行为”构建，适合作为 Next.js + MySQL 工程化作品集项目。

> 这是一个可自行接入 MySQL 的开源模板：仓库提供数据库结构、迁移脚本和配置模板，但不包含任何真实数据库、账号密码或用户上传文件。

## 项目亮点

- MySQL + Prisma 持久化：分类、文档、用户、VIP、星币与下载记录具有关联约束与迁移历史。
- 安全的服务端鉴权：JWT HttpOnly Cookie；后台接口在服务端校验管理员身份。
- 真实文件闭环：后台上传 PDF / Word / Excel / PPT，文件私有存储；下载时二次检查登录、VIP 与兑换记录。
- 文件生命周期管理：显示文件状态、编辑文档、替换源文件，删除文档时清理对应私有文件。
- 中英文界面、分类筛选、搜索、个人下载历史与后台管理。
- CI 与自动化测试：GitHub Actions 自动执行依赖安装、单元测试和生产构建。

## 架构

```text
Browser
  │
  ▼
Next.js App Router
  ├── Server Components / Route Handlers
  ├── JWT + HttpOnly Cookies
  ├── Prisma data access layer
  └── Private local document storage (development)
          │
          ▼
      MySQL 8.0
```

> 本地文件存储用于开发与作品展示。部署到 Serverless 平台时，请将 `src/lib/document-storage.ts` 替换为对象存储实现（如 Vercel Blob、OSS 或 COS）。

## 技术栈

- Next.js 16、React 19、TypeScript、Tailwind CSS 4
- MySQL 8 + Prisma ORM 7
- jose、bcryptjs
- Vitest、GitHub Actions

## 本地启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，填写本机配置：

```env
DATABASE_URL="mysql://用户名:密码@localhost:3306/standard_library"
JWT_SECRET="请使用随机强密钥"
ADMIN_PASSWORD="后台管理密码"
```

### 3. 应用数据库迁移

```bash
npx prisma migrate deploy
npx prisma generate
```

如果要从旧 SQLite 演示数据导入一次性数据：

```bash
npm run db:import
```

### 4. 启动

```bash
npm run dev
```

访问 `http://localhost:3000`，后台入口为 `/admin`。

## 开源使用与部署说明

本仓库不会上传或同步本机 MySQL。使用者克隆项目后，按下列流程配置自己的数据库即可：

```powershell
npm install
Copy-Item .env.example .env.local
# 编辑 .env.local，填写自己的 MySQL 连接串、JWT_SECRET 和 ADMIN_PASSWORD
npx prisma migrate deploy
npm run dev
```

提交到 GitHub 的内容包括 Prisma 数据表定义与迁移脚本；以下内容均由 `.gitignore` 排除：

- `.env.local`：数据库密码、JWT 密钥与后台密码
- `storage/documents/`：本地上传的私有资料
- `data/*.db`、`data/*.sqlite`：旧数据库文件与本地备份

> 项目不能“零配置一键部署”到 Vercel：云端环境无法访问开发者电脑上的 `localhost` MySQL。若要上线，请使用可从公网访问的云 MySQL，并在部署平台配置对应的 `DATABASE_URL`、`JWT_SECRET` 与 `ADMIN_PASSWORD`；文件存储也应替换为对象存储服务。

## 常用命令

```bash
npm run test             # 运行单元测试
npm run build            # 生产构建与类型检查
npm run lint             # ESLint 检查
npm run db:import        # 从旧 SQLite 导入一次性数据
npx prisma studio        # 可视化查看 MySQL 数据
```

## 文件与权限流程

```text
管理员上传文件
  → 服务端校验格式、MIME 类型和 20MB 大小限制
  → 写入私有 storage/documents 与 MySQL 元数据
  → 用户点击下载
  → 登录 / VIP / 星币校验
  → 记录下载并返回受控文件流
```

## 自动化质量门禁

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) 会在 push 和 Pull Request 时执行：

1. `npm ci`
2. `npm run test`
3. `npm run build`

## 后续规划

- 将本地文件存储抽象并接入云对象存储
- 标准版本、现行/废止状态与关联标准图谱
- 下载与合规数据仪表盘
- 基于引用页码的文档问答

## 安全说明

- `.env.local`、本地上传文件、生成客户端和旧 SQLite 备份均已被 Git 忽略。
- 不要将数据库连接串、JWT 密钥或后台密码提交到仓库。
