import { initDB } from './schema';
import { getDb, saveDb } from './db';
import bcrypt from 'bcryptjs';

// 测试用户数据
const testUsers = [
  { username: 'test', email: 'test@example.com', password: '123456', isVip: 0, stars: 100 },
  { username: 'vipuser', email: 'vip@example.com', password: '123456', isVip: 1, stars: 500 },
];

// 6 个分类
const categories = [
  { name: '行业标准', slug: '行业标准', icon: '📊', description: '各行业技术规范与标准文档' },
  { name: '国家标准', slug: '国家标准', icon: '🏛️', description: '国家发布的各类标准文件' },
  { name: '国际标准', slug: '国际标准', icon: '🌍', description: 'ISO、IEC 等国际组织标准' },
  { name: '企业标准', slug: '企业标准', icon: '🏢', description: '企业内部管理与技术标准' },
  { name: '地方标准', slug: '地方标准', icon: '📍', description: '各省市地方标准文件' },
  { name: '团体标准', slug: '团体标准', icon: '👥', description: '行业协会与团体组织标准' },
];

// 50 条文档数据
const documents = [
  // 行业标准 (10条)
  { title: '建筑工程施工质量验收统一标准', category: '行业标准', format: 'PDF', pages: 45, size: '3.2MB', price: 0, downloads: 1256, date: '2024-03-15', desc: '本标准规定了建筑工程施工质量验收的基本要求、验收程序和验收标准。', isVip: 0 },
  { title: '电力行业安全生产标准化规范', category: '行业标准', format: 'PDF', pages: 56, size: '4.2MB', price: 3, downloads: 678, date: '2024-02-25', desc: '电力行业安全生产标准化规范，适用于电力生产企业。', isVip: 0 },
  { title: '石油化工行业环境保护技术规范', category: '行业标准', format: 'DOC', pages: 38, size: '2.9MB', price: 6, downloads: 456, date: '2024-02-05', desc: '石油化工行业环境保护技术规范与要求。', isVip: 0 },
  { title: '机械行业安全生产标准化评定标准', category: '行业标准', format: 'PDF', pages: 42, size: '3.1MB', price: 4, downloads: 567, date: '2024-01-15', desc: '机械行业安全生产标准化评定标准和要求。', isVip: 0 },
  { title: '交通运输行业服务质量标准', category: '行业标准', format: 'PDF', pages: 35, size: '2.5MB', price: 0, downloads: 892, date: '2024-01-10', desc: '交通运输行业服务质量评价与管理标准。', isVip: 0 },
  { title: '食品加工行业卫生规范', category: '行业标准', format: 'DOC', pages: 28, size: '1.8MB', price: 5, downloads: 1023, date: '2023-12-20', desc: '食品加工行业卫生管理规范与操作要求。', isVip: 0 },
  { title: '医疗器械生产质量管理规范', category: '行业标准', format: 'PDF', pages: 65, size: '5.1MB', price: 8, downloads: 445, date: '2023-12-15', desc: '医疗器械生产质量管理规范及实施细则。', isVip: 1 },
  { title: '信息技术服务运维标准', category: '行业标准', format: 'PDF', pages: 48, size: '3.5MB', price: 0, downloads: 1567, date: '2023-12-01', desc: '信息技术服务运维管理标准与最佳实践。', isVip: 0 },
  { title: '教育培训行业质量管理标准', category: '行业标准', format: 'PPT', pages: 32, size: '6.2MB', price: 4, downloads: 334, date: '2023-11-20', desc: '教育培训行业质量管理与评估标准。', isVip: 0 },
  { title: '物流仓储行业安全管理规范', category: '行业标准', format: 'XLS', pages: 18, size: '1.2MB', price: 3, downloads: 678, date: '2023-11-10', desc: '物流仓储行业安全管理规范与检查清单。', isVip: 0 },

  // 国家标准 (10条)
  { title: '信息安全技术 网络安全等级保护基本要求', category: '国家标准', format: 'PDF', pages: 78, size: '5.1MB', price: 5, downloads: 892, date: '2024-03-10', desc: '本标准规定了网络安全等级保护的基本要求。', isVip: 0 },
  { title: 'GB/T 19001-2016 质量管理体系要求', category: '国家标准', format: 'DOC', pages: 48, size: '3.5MB', price: 0, downloads: 1567, date: '2024-02-20', desc: '等同采用 ISO 9001:2015 的国家标准。', isVip: 0 },
  { title: 'GB 50010-2010 混凝土结构设计规范', category: '国家标准', format: 'PDF', pages: 156, size: '15.2MB', price: 8, downloads: 2345, date: '2024-02-01', desc: '混凝土结构设计规范，适用于各类混凝土结构设计。', isVip: 0 },
  { title: 'GB/T 22239-2019 信息安全技术网络安全等级保护定级指南', category: '国家标准', format: 'PDF', pages: 28, size: '2.0MB', price: 6, downloads: 1456, date: '2024-01-10', desc: '网络安全等级保护定级指南。', isVip: 0 },
  { title: 'GB 18306-2015 中国地震动参数区划图', category: '国家标准', format: 'PDF', pages: 92, size: '8.5MB', price: 0, downloads: 789, date: '2023-12-25', desc: '中国地震动参数区划图国家标准。', isVip: 0 },
  { title: 'GB/T 50378-2019 绿色建筑评价标准', category: '国家标准', format: 'PDF', pages: 68, size: '4.8MB', price: 5, downloads: 1234, date: '2023-12-10', desc: '绿色建筑评价标准与技术要求。', isVip: 0 },
  { title: 'GB 50736-2012 民用建筑供暖通风与空气调节设计规范', category: '国家标准', format: 'DOC', pages: 125, size: '9.2MB', price: 10, downloads: 567, date: '2023-11-28', desc: '民用建筑供暖通风与空气调节设计规范。', isVip: 1 },
  { title: 'GB/T 28181-2016 公共安全视频监控联网系统信息传输、交换、控制技术要求', category: '国家标准', format: 'PDF', pages: 85, size: '6.3MB', price: 7, downloads: 890, date: '2023-11-15', desc: '公共安全视频监控联网系统技术要求。', isVip: 0 },
  { title: 'GB 50011-2010 建筑抗震设计规范', category: '国家标准', format: 'PDF', pages: 142, size: '12.8MB', price: 0, downloads: 1890, date: '2023-11-01', desc: '建筑抗震设计规范。', isVip: 0 },
  { title: 'GB/T 23331-2020 能源管理体系要求', category: '国家标准', format: 'PPT', pages: 45, size: '7.5MB', price: 6, downloads: 456, date: '2023-10-20', desc: '能源管理体系要求及使用指南。', isVip: 0 },

  // 国际标准 (8条)
  { title: 'ISO 9001:2015 质量管理体系要求', category: '国际标准', format: 'DOC', pages: 52, size: '2.8MB', price: 10, downloads: 2341, date: '2024-03-08', desc: 'ISO 9001:2015 质量管理体系要求。', isVip: 1 },
  { title: 'IEC 62368-1 音视频及信息技术设备安全', category: '国际标准', format: 'PDF', pages: 120, size: '12.5MB', price: 20, downloads: 234, date: '2024-02-18', desc: 'IEC 62368-1 音视频及信息技术设备安全要求。', isVip: 1 },
  { title: 'ISO 14001:2015 环境管理体系要求', category: '国际标准', format: 'PDF', pages: 45, size: '3.8MB', price: 10, downloads: 1234, date: '2024-01-28', desc: 'ISO 14001:2015 环境管理体系要求及使用指南。', isVip: 1 },
  { title: 'ISO 45001:2018 职业健康安全管理体系', category: '国际标准', format: 'PDF', pages: 42, size: '3.2MB', price: 12, downloads: 890, date: '2023-12-18', desc: 'ISO 45001:2018 职业健康安全管理体系要求。', isVip: 1 },
  { title: 'ISO 27001:2022 信息安全管理体系', category: '国际标准', format: 'DOC', pages: 58, size: '4.5MB', price: 15, downloads: 1567, date: '2023-12-05', desc: 'ISO 27001:2022 信息安全管理体系要求。', isVip: 1 },
  { title: 'IEC 61508 功能安全标准', category: '国际标准', format: 'PDF', pages: 180, size: '18.2MB', price: 25, downloads: 345, date: '2023-11-22', desc: 'IEC 61508 功能安全标准。', isVip: 1 },
  { title: 'ISO 22000:2018 食品安全管理体系', category: '国际标准', format: 'PDF', pages: 38, size: '2.8MB', price: 8, downloads: 678, date: '2023-11-08', desc: 'ISO 22000:2018 食品安全管理体系要求。', isVip: 0 },
  { title: 'ISO 13485:2016 医疗器械质量管理体系', category: '国际标准', format: 'PDF', pages: 55, size: '4.2MB', price: 18, downloads: 456, date: '2023-10-25', desc: 'ISO 13485:2016 医疗器械质量管理体系要求。', isVip: 1 },

  // 企业标准 (8条)
  { title: '华为公司内部项目管理规范 V3.0', category: '企业标准', format: 'PPT', pages: 36, size: '8.5MB', price: 15, downloads: 567, date: '2024-03-05', desc: '华为公司内部项目管理规范。', isVip: 1 },
  { title: '阿里巴巴集团数据安全管理办法', category: '企业标准', format: 'PDF', pages: 28, size: '1.8MB', price: 12, downloads: 890, date: '2024-02-15', desc: '阿里巴巴集团内部数据安全管理规范。', isVip: 1 },
  { title: '腾讯公司软件开发流程规范', category: '企业标准', format: 'DOC', pages: 22, size: '1.2MB', price: 0, downloads: 1890, date: '2024-01-25', desc: '腾讯公司内部软件开发流程规范文档。', isVip: 0 },
  { title: '字节跳动内容审核标准', category: '企业标准', format: 'PDF', pages: 35, size: '2.5MB', price: 10, downloads: 1234, date: '2024-01-12', desc: '字节跳动内容审核标准与操作指南。', isVip: 0 },
  { title: '京东物流仓储管理规范', category: '企业标准', format: 'XLS', pages: 15, size: '1.0MB', price: 8, downloads: 678, date: '2023-12-28', desc: '京东物流仓储管理规范与流程。', isVip: 0 },
  { title: '小米公司产品设计规范', category: '企业标准', format: 'PDF', pages: 42, size: '5.8MB', price: 0, downloads: 2345, date: '2023-12-12', desc: '小米公司产品设计规范与标准。', isVip: 0 },
  { title: '美团商家入驻审核标准', category: '企业标准', format: 'DOC', pages: 18, size: '1.5MB', price: 5, downloads: 890, date: '2023-11-28', desc: '美团商家入驻审核标准与流程。', isVip: 0 },
  { title: '网易游戏测试规范', category: '企业标准', format: 'PDF', pages: 32, size: '2.8MB', price: 12, downloads: 456, date: '2023-11-15', desc: '网易游戏测试规范与质量标准。', isVip: 1 },

  // 地方标准 (8条)
  { title: '北京市建设工程施工现场安全管理标准', category: '地方标准', format: 'PDF', pages: 32, size: '2.1MB', price: 0, downloads: 445, date: '2024-03-01', desc: '本标准适用于北京市建设工程施工现场的安全管理工作。', isVip: 0 },
  { title: '上海市绿色建筑评价标准', category: '地方标准', format: 'PPT', pages: 42, size: '6.8MB', price: 0, downloads: 345, date: '2024-02-10', desc: '上海市绿色建筑评价标准。', isVip: 0 },
  { title: '广东省建设工程计价依据', category: '地方标准', format: 'XLS', pages: 88, size: '8.2MB', price: 15, downloads: 678, date: '2024-01-20', desc: '广东省建设工程计价依据和标准。', isVip: 1 },
  { title: '浙江省数字化改革标准体系', category: '地方标准', format: 'PDF', pages: 56, size: '4.5MB', price: 8, downloads: 567, date: '2023-12-30', desc: '浙江省数字化改革标准体系建设指南。', isVip: 0 },
  { title: '深圳市智慧城市建设项目验收标准', category: '地方标准', format: 'PDF', pages: 38, size: '3.2MB', price: 6, downloads: 456, date: '2023-12-15', desc: '深圳市智慧城市建设项目验收标准。', isVip: 0 },
  { title: '江苏省建筑节能设计标准', category: '地方标准', format: 'DOC', pages: 65, size: '5.1MB', price: 0, downloads: 890, date: '2023-11-28', desc: '江苏省建筑节能设计标准。', isVip: 0 },
  { title: '四川省水利工程质量管理标准', category: '地方标准', format: 'PDF', pages: 45, size: '3.8MB', price: 5, downloads: 345, date: '2023-11-10', desc: '四川省水利工程质量管理标准。', isVip: 0 },
  { title: '山东省食品安全地方标准', category: '地方标准', format: 'PDF', pages: 28, size: '2.0MB', price: 4, downloads: 567, date: '2023-10-25', desc: '山东省食品安全地方标准汇编。', isVip: 0 },

  // 团体标准 (6条)
  { title: '中国人工智能产业发展联盟技术标准', category: '团体标准', format: 'XLS', pages: 15, size: '1.5MB', price: 8, downloads: 334, date: '2024-02-28', desc: '中国人工智能产业发展联盟发布的技术标准文件。', isVip: 0 },
  { title: '中国通信标准化协会 5G 技术标准', category: '团体标准', format: 'PDF', pages: 65, size: '5.5MB', price: 5, downloads: 567, date: '2024-02-08', desc: '中国通信标准化协会发布的 5G 技术相关标准。', isVip: 0 },
  { title: '中国物流与采购联合会冷链物流标准', category: '团体标准', format: 'PDF', pages: 35, size: '2.5MB', price: 0, downloads: 234, date: '2024-01-18', desc: '冷链物流行业技术标准和操作规范。', isVip: 0 },
  { title: '中国互联网协会数据治理标准', category: '团体标准', format: 'DOC', pages: 42, size: '3.2MB', price: 10, downloads: 789, date: '2023-12-22', desc: '中国互联网协会数据治理标准与指南。', isVip: 0 },
  { title: '中国汽车工程学会智能网联汽车标准', category: '团体标准', format: 'PDF', pages: 78, size: '6.8MB', price: 12, downloads: 456, date: '2023-12-08', desc: '中国汽车工程学会智能网联汽车标准。', isVip: 1 },
  { title: '中国电子商会智能家居互联互通标准', category: '团体标准', format: 'PDF', pages: 45, size: '3.5MB', price: 0, downloads: 678, date: '2023-11-22', desc: '中国电子商会智能家居互联互通标准。', isVip: 0 },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // 初始化数据库结构
  await initDB();

  const db = await getDb();

  // 清空现有数据
  db.run('DELETE FROM documents');
  db.run('DELETE FROM categories');

  // 插入分类
  const insertCategory = db.prepare(
    'INSERT INTO categories (name, slug, icon, description) VALUES (?, ?, ?, ?)'
  );

  for (const cat of categories) {
    insertCategory.run([cat.name, cat.slug, cat.icon, cat.description]);
  }
  insertCategory.free();

  // 获取分类 ID 映射
  const catRows = db.exec('SELECT id, name FROM categories');
  const catMap: Record<string, number> = {};
  if (catRows.length > 0) {
    for (const row of catRows[0].values) {
      catMap[row[1] as string] = row[0] as number;
    }
  }

  // 插入文档
  const insertDoc = db.prepare(
    `INSERT INTO documents (title, category_id, format, pages, file_size, price_stars, download_count, upload_time, description, is_vip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (const doc of documents) {
    const categoryId = catMap[doc.category];
    if (categoryId) {
      insertDoc.run([
        doc.title,
        categoryId,
        doc.format,
        doc.pages,
        doc.size,
        doc.price,
        doc.downloads,
        doc.date,
        doc.desc,
        doc.isVip,
      ]);
    }
  }
  insertDoc.free();

  // 插入测试用户
  db.run('DELETE FROM users');
  const insertUser = db.prepare(
    'INSERT INTO users (username, email, password_hash, is_vip, stars_balance) VALUES (?, ?, ?, ?, ?)'
  );

  for (const user of testUsers) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    insertUser.run([user.username, user.email, passwordHash, user.isVip, user.stars]);
  }
  insertUser.free();

  // 保存数据库
  saveDb();

  // 统计
  const docCount = db.exec('SELECT COUNT(*) FROM documents');
  const catCount = db.exec('SELECT COUNT(*) FROM categories');
  const userCount = db.exec('SELECT COUNT(*) FROM users');

  console.log(`✅ Seeded ${catCount[0]?.values[0]?.[0] || 0} categories`);
  console.log(`✅ Seeded ${docCount[0]?.values[0]?.[0] || 0} documents`);
  console.log(`✅ Seeded ${userCount[0]?.values[0]?.[0] || 0} users`);
  console.log('🎉 Database seed completed!');
}

seed().catch(console.error);
