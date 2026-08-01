# 标准文库

一个面向标准与合规资料管理的全栈应用。用户可以按分类和关键词查找资料，管理员可在后台查看运营概览、维护资料与用户；访问资料时会校验登录状态、VIP 权限和星币余额。

项目默认使用 SQL.js 提供内存中的演示数据：克隆即可运行，也可以直接部署到 Vercel 作为作品预览。需要长期保存业务数据时，可按下方流程接入 MySQL。

## 功能

| 模块 | 说明 |
| --- | --- |
| 资料检索 | 按分类和关键词浏览资料，支持格式、价格和 VIP 条件筛选。 |
| 资料详情 | 展示文件格式、页数、大小、上传时间、下载次数和访问条件。 |
| 受控访问 | 服务端校验登录、VIP 与星币余额，并记录本次演示会话中的下载行为。 |
| 管理后台 | 提供运营概览、资料管理、文件上传/替换、用户列表。 |
| 数据看板 | 展示资料、用户、下载趋势、分类分布和热门资料。 |
| 文件管理 | 本地支持 PDF、Word、Excel、PPT；校验 MIME 类型与 20MB 大小限制。 |

## 页面预览

### 首页

![首页：检索入口、分类浏览与最新资料](public/images/showcase/home.png)

### 分类资料库

![分类页：筛选条件与资料卡片](public/images/showcase/category.png)

### 资料详情

![详情页：文件信息、访问规则与下载入口](public/images/showcase/document-detail.png)

### 管理后台

![后台：运营概览与资料数据](public/images/showcase/admin-dashboard.png)

截图来自本地运行的真实页面；筛选、登录、后台和权限校验均可交互体验。

## 技术实现

```text
Browser
  │
  ▼
Next.js App Router
  ├─ Server Components / Route Handlers
  ├─ JWT + HttpOnly Cookie
  ├─ SQL.js 演示数据层
  └─ 本地私有文件目录（可替换为对象存储）
```

- Next.js 16、React 19、TypeScript、Tailwind CSS 4
- SQL.js、jose、bcryptjs
- Vitest、GitHub Actions

## 本地运行

### 环境要求

- Node.js 20 或更高版本

### 1. 安装依赖

```powershell
npm install
```

### 2. 配置环境变量

复制示例文件：

```powershell
Copy-Item .env.example .env.local
```

至少设置以下两项：

```env
JWT_SECRET="替换为随机生成的长字符串"
ADMIN_PASSWORD="后台登录密码"
```

`DATABASE_URL` 不再是默认运行所必需的配置。

### 3. 启动应用

```powershell
npm run dev
```

- 用户端：`http://localhost:3000`
- 管理后台：`http://localhost:3000/admin`

演示账号：`test / 123456`；VIP 演示账号：`vipuser / 123456`。这两个账号仅用于本地或线上预览，不应在正式环境复用。

## Vercel 预览

导入仓库后，在 Vercel 的 Environment Variables 中配置 `JWT_SECRET` 和 `ADMIN_PASSWORD`，再部署即可；不需要创建数据库。

SQL.js 在此项目中定位为“无外部服务的演示数据层”。Serverless 实例重启或切换后会重新载入种子资料，因此注册、下载计数和后台资料改动不保证长期保存。线上演示环境也会拒绝资料上传与修改，避免给出会持久化的错觉。

## 接入 MySQL（生产扩展）

当客户需要多实例共享数据、长期保存用户与下载记录时，建议切换至 MySQL 8，并将文件存储替换为对象存储（如 S3、COS 或 OSS）。仓库保留了 `prisma/schema.prisma` 和迁移记录，方便以现有的数据模型继续扩展。

1. 创建 MySQL 数据库，并在 `.env.local` 或部署平台配置：

   ```env
   DATABASE_URL="mysql://用户名:密码@主机:3306/standard_library"
   ```

2. 执行现有迁移并生成 Prisma Client：

   ```powershell
   npx prisma migrate deploy
   npx prisma generate
   ```

3. 将 `src/lib/sqljs-repository.ts` 替换为对应的 Prisma Repository 实现；现有 `prisma/` 目录中的模型字段可直接作为资料、用户、下载记录的数据契约。

4. 将 `src/lib/document-storage.ts` 改为对象存储适配器，并把 `storageKey`、原始文件名和 MIME 类型写入 MySQL。下载接口继续使用现有的鉴权与权限校验逻辑即可。

这一步是有意保留的部署扩展点：作品预览无需数据库，真实业务再接入持久化服务，避免把本机 MySQL 配置或数据库文件提交到仓库。

## 常用命令

```powershell
npm run dev       # 启动开发服务器
npm run test      # 运行单元测试
npm run build     # 生产构建和类型检查
```

## 工程说明

- GitHub Actions 在 push 和 Pull Request 时执行依赖安装、单元测试和生产构建。
- 管理端接口在服务端校验管理员身份；`.env.local`、上传文件和本地数据库备份均不进入仓库。
- SQL.js 负责快速预览；MySQL 与对象存储是面向真实部署的可替换基础设施。
