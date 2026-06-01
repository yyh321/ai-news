# AI 每日早报网站设计文档

**日期**: 2026-06-01
**状态**: 已确认，待实现

---

## 1. 概述

一个部署在 Vercel 上的 AI 新闻聚合网站，每天自动抓取最新 AI 新闻，以卡片列表形式展示，支持展开查看摘要并提供原文链接。

## 2. 目标

- 每天自动获取并展示 10 条最新 AI 新闻
- 提供美观、易读的阅读体验
- 支持查看最近 7 天的新闻历史
- 单点故障降级，服务高可用

## 3. 非目标（本阶段不做）

- 用户系统 / 登录 / 收藏
- 全文抓取与本地存储（避免版权问题）
- 多语言支持
- 邮件/推送通知
- 新闻分类/标签筛选

## 4. 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 存储 | Vercel KV (Redis) |
| 部署 | Vercel |
| 定时任务 | Vercel Cron Jobs |

## 5. 架构

```
[Vercel Cron Job] → [Next.js API Route: /api/cron/fetch-news]
                            ↓
                    [RSS 抓取] + [搜索补充]
                            ↓
                    [解析 → 去重 → 排序 → 取前10]
                            ↓
                    [Vercel KV 存储]
                            ↓
[用户访问] → [Next.js 页面] → [读取 KV] → [展示]
```

### 目录结构

```
app/
  page.tsx                    # 新闻列表首页
  layout.tsx                  # 根布局
  globals.css                 # 全局样式
  api/
    cron/
      fetch-news/
        route.ts              # 定时抓取 API
    news/
      route.ts                # 新闻数据 API
components/
  NewsCard.tsx                # 新闻卡片组件
  NewsList.tsx                # 新闻列表组件
  Header.tsx                  # 顶部标题栏
  Footer.tsx                  # 底部页脚
lib/
  rss.ts                      # RSS 抓取与解析
  search.ts                   # 搜索补充逻辑
  kv.ts                       # Vercel KV 封装
  types.ts                    # TypeScript 类型定义
vercel.json                   # Cron Job 配置
```

## 6. 数据流

### 6.1 新闻数据结构

```typescript
interface NewsItem {
  id: string;                    // UUID
  title: string;                 // 新闻标题
  summary: string;               // 简要摘要（50字以内，列表页展示）
  fullSummary: string;           // 完整摘要（200-300字，展开后展示）
  source: string;                // 来源名称，如"机器之心"
  sourceUrl: string;             // 原文链接
  publishedAt: string;           // 发布时间（ISO 8601）
  fetchedAt: string;             // 抓取时间（ISO 8601）
}
```

### 6.2 存储策略

- **当天数据**: KV key 为 `news:daily:YYYY-MM-DD`，value 为 `NewsItem[]` JSON 字符串
- **最新指针**: KV key 为 `news:latest`，value 为当天日期 `YYYY-MM-DD`
- **历史保留**: 保留最近 7 天数据，超期数据自动覆盖（无需显式清理，因每日固定 key 会被覆盖）
- **数据量估算**: 10 条新闻/天 × 7 天 ≈ 极小数据量，Vercel KV 免费额度完全够用

### 6.3 抓取流程（每天 8:00 执行）

1. 并行抓取 4-5 个 RSS 源（使用 `Promise.allSettled`，单点失败不影响整体）
2. 并行执行搜索补充（获取 2-3 条热门新闻）
3. 解析所有结果，提取标题、链接、发布时间、摘要
4. 基于 URL 去重（相同 URL 只保留一条）
5. 按发布时间倒序排序
6. 截取前 10 条
7. 生成 `NewsItem` 数组，写入 KV

### 6.4 RSS 源列表（可配置）

| 来源 | RSS URL | 类型 |
|------|---------|------|
| 机器之心 | https://www.jiqizhixin.com/rss | 中文 |
| 量子位 | https://www.qbitai.com/feed | 中文 |
| Paper Digest | https://www.paperdigest.org/feed/ | 英文 |
| Synced Review | https://syncedreview.com/feed/ | 英文 |

> 搜索补充逻辑通过通用 Web 搜索实现，关键词为"AI 人工智能 最新新闻"，取前 2-3 条结果。

## 7. 前端设计

### 7.1 页面布局

**首页 `/`**

```
┌─────────────────────────────────────┐
│  🤖 AI 每日早报        2026-06-01    │
│  最后更新：08:05                      │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ▍ OpenAI 发布新模型...      │   │
│  │    机器之心 · 2小时前        │   │
│  │                             │   │
│  │ [简要摘要...]                │   │
│  │                             │   │
│  │ [点击展开 ▼]                 │   │
│  └─────────────────────────────┘   │
│              ...                    │
│                                     │
│  ────────── 昨天 05-31 ──────────   │
│  [可折叠历史区域]                    │
│                                     │
│  © 2026 AI Daily · GitHub           │
└─────────────────────────────────────┘
```

### 7.2 视觉风格（现代资讯风）

- **背景**: `#FFFFFF` 纯白
- **主文字**: `#1F2937` 深灰
- **次要文字**: `#6B7280` 中灰
- **强调色**: `#2563EB` 科技蓝（链接、展开按钮、悬浮边框）
- **卡片边框**: `1px solid #E5E7EB`，圆角 `12px`
- **字体**: 中文系统默认无衬线（PingFang SC / Microsoft YaHei），英文 Inter
- **来源标识线**: 每条卡片左侧 4px 彩色竖线标识来源
  - 机器之心: `#2563EB` 蓝
  - 量子位: `#10B981` 绿
  - 其他 RSS: `#8B5CF6` 紫
  - 搜索补充: `#F59E0B` 橙
- **悬浮效果**: `shadow-md` + 边框变为 `#2563EB`，过渡 `200ms`
- **展开动画**: 高度过渡 `300ms ease-in-out`，箭头旋转 `180deg`
- **时间显示**: 相对时间（"2小时前" / "昨天" / "3天前"）

### 7.3 交互行为

- **默认状态**: 所有卡片收起，展示标题 + 来源/时间 + 50 字简要摘要
- **点击展开**: 同卡片内展开显示 `fullSummary`（200-300 字）
- **点击收起**: 收起回默认状态
- **阅读原文**: 展开后底部出现外链按钮，新标签页打开 `sourceUrl`
- **日期切换**: 顶部日期选择器可查看过去 7 天新闻（读取对应 KV key）
- **加载状态**: 骨架屏（Shimmer 效果）
- **空状态**: "今日新闻更新中，请稍后再试" + 显示前一天数据入口

### 7.4 响应式

- **桌面端**（≥768px）: 卡片最大宽度 `720px`，页面居中，左右留白
- **移动端**（<768px）: 卡片全宽，左右留白 `16px`，触控区域 ≥44px

## 8. API 设计

### 8.1 GET /api/news?date=YYYY-MM-DD

**功能**: 获取指定日期的新闻列表

**参数**:
- `date` (可选): 日期格式 `YYYY-MM-DD`，默认当天

**响应**:
```json
{
  "date": "2026-06-01",
  "items": [
    {
      "id": "uuid",
      "title": "...",
      "summary": "...",
      "fullSummary": "...",
      "source": "机器之心",
      "sourceUrl": "https://...",
      "publishedAt": "2026-06-01T06:00:00Z",
      "fetchedAt": "2026-06-01T08:05:00Z"
    }
  ],
  "count": 10
}
```

**错误响应**:
- 404: 该日期无数据
- 500: KV 读取失败

### 8.2 GET /api/cron/fetch-news

**功能**: 触发新闻抓取（仅由 Vercel Cron Job 调用，也可手动触发）

**安全**: 通过 Vercel Cron Job 的 `Authorization` header 校验，或检查 `CRON_SECRET` 环境变量

**响应**:
```json
{
  "success": true,
  "date": "2026-06-01",
  "fetched": 10,
  "sources": ["机器之心", "量子位", "搜索补充"],
  "errors": []
}
```

## 9. 定时任务配置

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-news",
      "schedule": "0 8 * * *"
    }
  ]
}
```

**执行时间**: 每天上午 8:00（UTC+8 需根据 Vercel 时区调整，Vercel Cron 使用 UTC，因此实际配置为 `"0 0 * * *"` 如果需要北京时间 8:00）

> **注意**: Vercel Cron Jobs 使用 UTC 时间。若需北京时间 8:00 执行，应配置为 `"0 0 * * *"`（UTC 00:00 = 北京时间 08:00）。

## 10. 错误处理与降级

| 故障场景 | 处理策略 |
|---------|---------|
| 单个 RSS 源失效 | `Promise.allSettled` 隔离故障，其他源正常处理，失败源记录日志 |
| 所有 RSS 源失效 | 降级为仅展示搜索补充结果（2-3 条），不报错 |
| 搜索补充失败 | 静默忽略，不影响 RSS 结果 |
| KV 写入失败 | 保留前一天 `news:latest` 数据，不覆盖，次日重试 |
| KV 读取失败 | 返回空数组 + 友好提示"数据更新中"，显示前一天入口 |
| 抓取超时（>30s） | 中断并返回已获取的部分结果，不阻塞 |

## 11. 部署

### 11.1 环境变量

| 变量名 | 说明 | 来源 |
|--------|------|------|
| `KV_URL` | Vercel KV REST URL | Vercel 自动生成 |
| `KV_REST_API_TOKEN` | Vercel KV REST Token | Vercel 自动生成 |
| `CRON_SECRET` | Cron Job 校验密钥 | 手动设置（任意随机字符串）|
| `RSS_SOURCES` | 逗号分隔的 RSS 源列表（可选，默认使用内置列表） | 手动设置 |

### 11.2 部署步骤

1. 代码推送到 GitHub
2. Vercel 导入项目，自动识别 Next.js
3. 连接 Vercel KV（创建存储并绑定到项目）
4. 设置环境变量 `CRON_SECRET`
5. 首次手动触发 `/api/cron/fetch-news` 填充初始数据
6. 配置自定义域名（可选）

## 12. 性能考量

- **ISR**: 首页使用 `revalidate: 3600`（每小时增量重建），减少 KV 读取压力
- **KV 读取**: 单次读取 < 50ms，无需额外缓存层
- **图片**: 本设计不使用新闻配图，避免图片加载和版权风险
- **Bundle 体积**: 不使用 heavy UI 库，保持轻量

## 13. 未来扩展（非本阶段）

- 用户点击统计（Vercel Analytics）
- 热门新闻排序（基于点击率）
- RSS 源管理后台
- 邮件订阅每日推送
- 深色模式切换
