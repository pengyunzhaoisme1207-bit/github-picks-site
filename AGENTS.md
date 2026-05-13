# GitHub Picks · Agent 规则

> 本文档是 github-picks-site 项目的强制规则。
> 任何 Agent 修改本项目代码前，必须先读并遵守本文档。

## 项目基本信息

```
名称：GitHubPicks
口号：Discover the Best GitHub Projects for Real People
子域名：github.next-happy.com
技术栈：Next.js App Router + TypeScript + Tailwind CSS（当前 package 使用 Next.js 16）
数据：JSON 文件驱动，构建时静态生成 (SSG)
部署：Vercel
仓库：github-picks-site（pengyunzhaoisme1207-bit 下）
```

## 核心定位

面向**普通人**的 GitHub 优质项目推荐站。场景导向、人工筛选、普通人友好。

## 内容质量红线（强制）

### 禁止项

- **禁止**直接复制 GitHub 官方 README 描述作为 one_liner / editors_note
- **禁止**所有项目使用相同的模板化句式（必须差异化表达）
- **禁止**出现占位文本、Lorem Ipsum、TODO 注释上线
- **禁止**薄内容页面（每页正文 < 400 字不得上线）
- **禁止**假广告占位符或指向不存在的页面
- **禁止**在前端代码中硬编码 API Key、密钥、Token

### 必须项

- 每个项目必须有**原创** one_liner / highlights / use_cases / editors_note
- one_liner ≤ 120 字符，一句话告诉用户这个项目能帮他做什么
- highlights 3 条，每条 ≤ 60 字符，具体功能/优势/亮点
- use_cases 2-3 个，带具体场景描述（"当你要...时可以用它"）
- editors_note 50-100 字，编辑主观推荐理由
- 分类描述 150 字，介绍该分类解决什么问题
- 指南文章 800-1200 字，原创内容

### 语言标准

- 全站英文为主（SEO 主战场）
- 日期格式：YYYY-MM-DD（ISO 8601）
- 周格式：YYYY-Www（如 2026-W20）
- 数字格式：≥1000 时用 k 简写（如 42k 而非 42000）

## SEO 标准（强制）

| 项目 | 标准 |
|---|---|
| Title | 50-60 字符，包含主关键词，带年份提升 CTR |
| Description | 150-160 字符，前 80 字符包含核心信息 |
| H1 | 每页唯一，包含核心关键词 |
| Canonical | 每页必须设置，指向正式 URL |
| 内部链接 | 每页至少 3 个内部链接 |
| JSON-LD | 详情页 Article schema，含 datePublished / dateModified / author |
| 图片 alt | 所有图标/图片必须有 alt 文本 |

## AdSense 标准（强制）

- 申请前必须有：15+ 实质内容页、完整 privacy/about/contact、英文原创
- 移动端每屏最多 1 个广告单元
- 工具按钮周围 48px 范围不放广告
- 广告不遮挡核心功能区域
- 隐私政策页面必须说明 Cookie 和数据使用

## 组件规范

### AdSlot 组件

统一广告位组件，所有页面共用：

```
props:
  - slot: 'top' | 'middle' | 'result' | 'bottom' | 'inline'
  - className?: string（可选覆盖样式）

行为:
  - 开发环境显示占位标识 [AdSlot: {slot}]
- 生产环境仅在配置真实数字广告位 ID 后渲染手动 AdSense 单元
- Auto Ads 通过全站脚本接入，不允许把 top/middle/result 当成 data-ad-slot
  - 移动端自动限制每屏最多 1 个
```

### ProjectCard 组件

```
props:
  - project: Project 对象
  - variant: 'default' | 'large' | 'weekly'
  - showStars?: boolean
  - showDifficulty?: boolean
```

### 样式规范

- 设计风格：Linear.app / Vercel 简洁现代风格
- 字体：系统字体栈（禁止使用 next/font/google）
- 主色调：待设计确定后补充
- 项目卡片：边框 + 轻微阴影，hover 时边框变色
- 难度星级：⭐ 新手 / ⭐⭐ 需基础 / ⭐⭐⭐ 开发者向

## 提交标准（强制）

### 提交前验证

```bash
npm run lint    # 0 错误
npm run build   # 成功
```

### 提交信息格式

```
type(scope): description

types: feat | fix | docs | style | refactor | chore | content
scopes: home | project | category | weekly | compare | use-case | guide | data | components | seo | deploy
```

示例：
```
content(data): add 10 projects to finance category
feat(components): add AdSlot component with dev placeholder
fix(seo): add canonical URLs to all template pages
```

## 更新 SOP（每周执行）

1. 在 data/projects.json 末尾追加新项目（5-10 个/周）
2. 更新 data/weekly-picks.json（current_week + picks + archive）
3. （可选）更新项目的 stars 数字
4. 运行 npm run lint && npm run build
5. 确认 sitemap.xml 已包含新页面
6. 提交 + 推送 + 输出 AGENTS.md 格式报告

## 新项目收录标准

- Stars ≥ 500（有社区验证）
- 最近 6 个月有提交记录（活跃维护）
- 有 README 说明
- License 为开源协议
- 对非开发者有价值，或对开发者有显著提升效率的价值

## 与其他站的互链

| 来源 | 目标 | 链接文案 |
|---|---|---|
| next-happy.com AI 评测页 | github.next-happy.com | "See the open source alternative on GitHubPicks" |
| github.next-happy.com AI 项目页 | next-happy.com | "Compare top AI tools on next-happy.com" |
| github.next-happy.com footer | converter.next-happy.com | "Free Unit Converter" |
| github.next-happy.com Claude Code 页 | prompt.next-happy.com | "Find the best Claude Code prompts" |
| prompt.next-happy.com | github.next-happy.com | "Discover open source AI tools on GitHubPicks" |

## 部署红线

- 部署前必须向用户确认
- DNS 配置必须经用户审核
- AdSense 申请必须用户亲自操作
- Vercel 项目设置必须用户确认

最后更新：2026-05-13
