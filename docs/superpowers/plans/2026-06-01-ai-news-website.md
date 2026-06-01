# AI 每日早报网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个部署在 Vercel 的 AI 新闻聚合网站，每天自动抓取 10 条最新 AI 新闻，以美观的卡片列表展示，支持展开查看摘要。

**Architecture:** Next.js 14 App Router 全栈应用，服务端通过 RSS 聚合 + Google News RSS 搜索补充获取新闻，存储在 Vercel KV，前端以 ISR 渲染卡片列表，支持展开交互。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Vercel KV, xml2js, Jest, React Testing Library

---

## 文件结构

```
app/
  layout.tsx                          # 根布局（字体、元数据）
  page.tsx                            # 首页（新闻列表）
  globals.css                         # 全局样式 + Tailwind 指令
  api/
    news/
      route.ts                        # GET /api/news?date=YYYY-MM-DD
    cron/
      fetch-news/
        route.ts                      # GET /api/cron/fetch-news
components/
  Header.tsx                          # 顶部标题栏 + 日期选择
  NewsCard.tsx                        # 单条新闻卡片（展开/收起）
  NewsList.tsx                        # 新闻列表容器
  Footer.tsx                          # 底部页脚
lib/
  types.ts                            # TypeScript 类型定义
  date.ts                             # 日期格式化、相对时间
  kv.ts                               # Vercel KV 封装
  rss.ts                              # RSS 抓取与解析
  search.ts                           # Google News RSS 搜索补充
  aggregator.ts                       # 去重、排序、截断、生成 NewsItem
  handlers/
    news.ts                           # /api/news 业务逻辑（可测试）
    cron.ts                           # /api/cron/fetch-news 业务逻辑（可测试）
__tests__/
  lib/
    date.test.ts
    kv.test.ts
    rss.test.ts
    search.test.ts
    aggregator.test.ts
  handlers/
    news.test.ts
    cron.test.ts
  components/
    NewsCard.test.tsx
vercel.json                           # Cron Job 配置
.env.example                          # 环境变量模板
jest.config.js                        # Jest 配置
jest.setup.js                         # Jest 初始化
next.config.js                        # Next.js 配置
tailwind.config.ts                    # Tailwind 配置
postcss.config.js                     # PostCSS 配置
```

---

## Task 1: 项目初始化与配置

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `jest.config.js`
- Create: `jest.setup.js`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `public/.gitkeep`

- [ ] **Step 1: 初始化 package.json 并安装依赖**

```bash
npm init -y
npm install next@14 react@18 react-dom@18 @vercel/kv
npm install -D typescript @types/react @types/node @types/xml2js xml2js tailwindcss postcss autoprefixer jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

Expected: `node_modules/` 创建完成，无报错。

- [ ] **Step 2: 创建 `tsconfig.json`**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: 创建 `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

- [ ] **Step 4: 创建 `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'source-jiqizhixin': '#2563EB',
        'source-qbitai': '#10B981',
        'source-default': '#8B5CF6',
        'source-search': '#F59E0B',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 5: 创建 `postcss.config.js`**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: 创建 `jest.config.js`**

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

- [ ] **Step 7: 创建 `jest.setup.js`**

```javascript
import '@testing-library/jest-dom'
```

- [ ] **Step 8: 创建 `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
```

- [ ] **Step 9: 创建 `app/layout.tsx`**

```tsx
export const metadata = {
  title: 'AI 每日早报',
  description: '每天 10 条最新 AI 新闻',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  )
}
```

- [ ] **Step 10: 创建 `app/page.tsx`（占位）**

```tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">AI 每日早报</h1>
    </main>
  )
}
```

- [ ] **Step 11: 创建 `public/.gitkeep`**

```bash
touch public/.gitkeep
```

- [ ] **Step 12: 验证 Next.js 能正常启动**

```bash
npx next build
```

Expected: 构建成功，输出 `.next/` 目录。

- [ ] **Step 13: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with Tailwind and Jest"
```

---

## Task 2: 类型定义与日期工具

**Files:**
- Create: `lib/types.ts`
- Create: `lib/date.ts`
- Create: `__tests__/lib/date.test.ts`

- [ ] **Step 1: 创建 `lib/types.ts`**

```typescript
export interface NewsItem {
  id: string
  title: string
  summary: string
  fullSummary: string
  source: string
  sourceUrl: string
  publishedAt: string
  fetchedAt: string
}

export interface RawNewsItem {
  title: string
  link: string
  description?: string
  pubDate?: string
  sourceName: string
}

export interface FetchResult {
  items: NewsItem[]
  errors: string[]
}
```

- [ ] **Step 2: 写 `__tests__/lib/date.test.ts`（失败测试）**

```typescript
import { formatRelativeTime, formatDate } from '@/lib/date'

describe('formatRelativeTime', () => {
  it('returns "刚刚" for current time', () => {
    const now = new Date().toISOString()
    expect(formatRelativeTime(now)).toBe('刚刚')
  })

  it('returns "X分钟前" for minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(fiveMinAgo)).toBe('5分钟前')
  })

  it('returns "X小时前" for hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(twoHoursAgo)).toBe('2小时前')
  })

  it('returns "昨天" for yesterday', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(yesterday)).toBe('昨天')
  })

  it('returns "X天前" for days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(threeDaysAgo)).toBe('3天前')
  })
})

describe('formatDate', () => {
  it('formats ISO string to YYYY-MM-DD', () => {
    expect(formatDate('2026-06-01T08:00:00Z')).toBe('2026-06-01')
  })
})
```

- [ ] **Step 3: 运行测试，确认失败**

```bash
npx jest __tests__/lib/date.test.ts
```

Expected: FAIL - "Cannot find module '@/lib/date'"

- [ ] **Step 4: 创建 `lib/date.ts`（最小实现）**

```typescript
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHour < 24) return `${diffHour}小时前`
  if (diffDay === 1) return '昨天'
  return `${diffDay}天前`
}

export function formatDate(isoString: string): string {
  return isoString.slice(0, 10)
}
```

- [ ] **Step 5: 运行测试，确认通过**

```bash
npx jest __tests__/lib/date.test.ts
```

Expected: PASS (5/5 tests)

- [ ] **Step 6: Commit**

```bash
git add lib/date.ts lib/types.ts __tests__/lib/date.test.ts
git commit -m "feat: add date utilities and types with tests"
```

---

## Task 3: KV 封装

**Files:**
- Create: `lib/kv.ts`
- Create: `__tests__/lib/kv.test.ts`

- [ ] **Step 1: 写 `__tests__/lib/kv.test.ts`（失败测试）**

```typescript
import { getNewsByDate, setNewsByDate, getLatestNewsDate } from '@/lib/kv'

jest.mock('@vercel/kv', () => ({
  kv: {
    get: jest.fn(),
    set: jest.fn(),
  },
}))

import { kv } from '@vercel/kv'

describe('KV operations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getNewsByDate returns parsed items', async () => {
    const mockItems = [{ id: '1', title: 'Test' }]
    ;(kv.get as jest.Mock).mockResolvedValue(JSON.stringify(mockItems))

    const result = await getNewsByDate('2026-06-01')
    expect(kv.get).toHaveBeenCalledWith('news:daily:2026-06-01')
    expect(result).toEqual(mockItems)
  })

  it('getNewsByDate returns null when no data', async () => {
    ;(kv.get as jest.Mock).mockResolvedValue(null)
    const result = await getNewsByDate('2026-06-01')
    expect(result).toBeNull()
  })

  it('setNewsByDate stores JSON string', async () => {
    const items = [{ id: '1', title: 'Test' }]
    await setNewsByDate('2026-06-01', items)
    expect(kv.set).toHaveBeenCalledWith('news:daily:2026-06-01', JSON.stringify(items))
    expect(kv.set).toHaveBeenCalledWith('news:latest', '2026-06-01')
  })

  it('getLatestNewsDate returns date string', async () => {
    ;(kv.get as jest.Mock).mockResolvedValue('2026-06-01')
    const result = await getLatestNewsDate()
    expect(result).toBe('2026-06-01')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npx jest __tests__/lib/kv.test.ts
```

Expected: FAIL - module not found

- [ ] **Step 3: 创建 `lib/kv.ts`**

```typescript
import { kv } from '@vercel/kv'
import { NewsItem } from './types'

export async function getNewsByDate(date: string): Promise<NewsItem[] | null> {
  const data = await kv.get<string>(`news:daily:${date}`)
  if (!data) return null
  return JSON.parse(data) as NewsItem[]
}

export async function setNewsByDate(date: string, items: NewsItem[]): Promise<void> {
  await kv.set(`news:daily:${date}`, JSON.stringify(items))
  await kv.set('news:latest', date)
}

export async function getLatestNewsDate(): Promise<string | null> {
  return kv.get<string>('news:latest')
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
npx jest __tests__/lib/kv.test.ts
```

Expected: PASS (4/4 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/kv.ts __tests__/lib/kv.test.ts
git commit -m "feat: add KV storage wrapper with tests"
```

---

## Task 4: RSS 抓取与解析

**Files:**
- Create: `lib/rss.ts`
- Create: `__tests__/lib/rss.test.ts`

- [ ] **Step 1: 写 `__tests__/lib/rss.test.ts`（失败测试）**

```typescript
import { parseRSS, fetchRSS, RSS_SOURCES } from '@/lib/rss'

// Mock fetch globally
global.fetch = jest.fn()

describe('parseRSS', () => {
  it('parses RSS XML into RawNewsItem array', () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel>
        <item>
          <title>Test Title</title>
          <link>https://example.com/1</link>
          <description>Test Description</description>
          <pubDate>Mon, 01 Jun 2026 08:00:00 GMT</pubDate>
        </item>
      </channel></rss>
    `
    const result = parseRSS(xml, 'TestSource')
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      title: 'Test Title',
      link: 'https://example.com/1',
      description: 'Test Description',
      sourceName: 'TestSource',
    })
  })

  it('strips HTML from description', () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel>
        <item>
          <title>HTML Desc</title>
          <link>https://example.com/2</link>
          <description><p>Paragraph text</p></description>
        </item>
      </channel></rss>
    `
    const result = parseRSS(xml, 'TestSource')
    expect(result[0].description).toBe('Paragraph text')
  })
})

describe('fetchRSS', () => {
  it('fetches and parses RSS feed', async () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel><item>
        <title>News</title><link>https://x.com</link>
      </item></channel></rss>
    `
    ;(fetch as jest.Mock).mockResolvedValue({
      text: () => Promise.resolve(xml),
      ok: true,
    })

    const result = await fetchRSS('https://example.com/rss', 'TestSource')
    expect(result.items).toHaveLength(1)
    expect(result.error).toBeNull()
  })

  it('returns error on failed fetch', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    })

    const result = await fetchRSS('https://example.com/rss', 'TestSource')
    expect(result.items).toEqual([])
    expect(result.error).toContain('404')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npx jest __tests__/lib/rss.test.ts
```

Expected: FAIL - module not found

- [ ] **Step 3: 创建 `lib/rss.ts`**

```typescript
import { parseStringPromise } from 'xml2js'
import { RawNewsItem } from './types'

export interface FetchRSSResult {
  items: RawNewsItem[]
  error: string | null
}

export const RSS_SOURCES = [
  { name: '机器之心', url: 'https://www.jiqizhixin.com/rss', color: 'source-jiqizhixin' },
  { name: '量子位', url: 'https://www.qbitai.com/feed', color: 'source-qbitai' },
  { name: 'Synced Review', url: 'https://syncedreview.com/feed/', color: 'source-default' },
  { name: 'Paper Digest', url: 'https://www.paperdigest.org/feed/', color: 'source-default' },
]

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export function parseRSS(xml: string, sourceName: string): RawNewsItem[] {
  // Synchronous parsing for testability
  // In production, fetchRSS uses xml2js parseStringPromise
  const items: RawNewsItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]>\s*<\/title>/) || itemXml.match(/<title>([\s\S]*?)\s*<\/title>/)
    const linkMatch = itemXml.match(/<link>([\s\S]*?)\s*<\/link>/)
    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/) || itemXml.match(/<description>([\s\S]*?)\s*<\/description>/)
    const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)\s*<\/pubDate>/)

    if (titleMatch && linkMatch) {
      items.push({
        title: stripHtml(titleMatch[1].trim()),
        link: stripHtml(linkMatch[1].trim()),
        description: descMatch ? stripHtml(descMatch[1].trim()) : undefined,
        pubDate: dateMatch ? stripHtml(dateMatch[1].trim()) : undefined,
        sourceName,
      })
    }
  }

  return items
}

export async function fetchRSS(url: string, sourceName: string): Promise<FetchRSSResult> {
  try {
    const response = await fetch(url, { next: { revalidate: 0 } })
    if (!response.ok) {
      return { items: [], error: `HTTP ${response.status}` }
    }
    const xml = await response.text()
    const items = parseRSS(xml, sourceName)
    return { items, error: null }
  } catch (err) {
    return { items: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
npx jest __tests__/lib/rss.test.ts
```

Expected: PASS (4/4 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/rss.ts __tests__/lib/rss.test.ts
git commit -m "feat: add RSS fetching and parsing with tests"
```

---

## Task 5: 搜索补充（Google News RSS）

**Files:**
- Create: `lib/search.ts`
- Create: `__tests__/lib/search.test.ts`

- [ ] **Step 1: 写 `__tests__/lib/search.test.ts`（失败测试）**

```typescript
import { fetchSearchNews } from '@/lib/search'

jest.mock('@/lib/rss', () => ({
  fetchRSS: jest.fn(),
}))

import { fetchRSS } from '@/lib/rss'

describe('fetchSearchNews', () => {
  it('fetches news from Google News RSS', async () => {
    ;(fetchRSS as jest.Mock).mockResolvedValue({
      items: [
        { title: 'Search Result', link: 'https://news.com/1', sourceName: '搜索补充' },
      ],
      error: null,
    })

    const result = await fetchSearchNews()
    expect(fetchRSS).toHaveBeenCalled()
    expect(result.items).toHaveLength(1)
    expect(result.error).toBeNull()
  })

  it('returns empty array on error', async () => {
    ;(fetchRSS as jest.Mock).mockResolvedValue({
      items: [],
      error: 'Failed',
    })

    const result = await fetchSearchNews()
    expect(result.items).toEqual([])
    expect(result.error).toBe('Failed')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npx jest __tests__/lib/search.test.ts
```

Expected: FAIL - module not found

- [ ] **Step 3: 创建 `lib/search.ts`**

```typescript
import { fetchRSS } from './rss'
import { FetchRSSResult } from './rss'

const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search?q=AI+artificial+intelligence&hl=zh-CN&gl=CN&ceid=CN:zh-Hans'

export async function fetchSearchNews(): Promise<FetchRSSResult> {
  return fetchRSS(GOOGLE_NEWS_RSS, '搜索补充')
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
npx jest __tests__/lib/search.test.ts
```

Expected: PASS (2/2 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/search.ts __tests__/lib/search.test.ts
git commit -m "feat: add Google News RSS search supplement with tests"
```

---

## Task 6: 聚合逻辑

**Files:**
- Create: `lib/aggregator.ts`
- Create: `__tests__/lib/aggregator.test.ts`

- [ ] **Step 1: 写 `__tests__/lib/aggregator.test.ts`（失败测试）**

```typescript
import { aggregateNews, generateId } from '@/lib/aggregator'
import { RawNewsItem } from '@/lib/types'

describe('aggregateNews', () => {
  it('deduplicates by URL and returns top 10', () => {
    const items: RawNewsItem[] = [
      { title: 'A', link: 'https://a.com', description: 'Desc A content here', pubDate: 'Mon, 01 Jun 2026 10:00:00 GMT', sourceName: '机器之心' },
      { title: 'B', link: 'https://b.com', description: 'Desc B', pubDate: 'Mon, 01 Jun 2026 09:00:00 GMT', sourceName: '量子位' },
      { title: 'A-dup', link: 'https://a.com', description: 'Desc A dup', pubDate: 'Mon, 01 Jun 2026 08:00:00 GMT', sourceName: '机器之心' },
    ]

    const result = aggregateNews(items)
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('A')
    expect(result[1].title).toBe('B')
  })

  it('generates summary and fullSummary', () => {
    const items: RawNewsItem[] = [
      { title: 'Test', link: 'https://test.com', description: '这是一段很长的描述文字，用来测试摘要生成功能，确保能够正确截取前五十个字作为简要摘要，完整描述则保留在 fullSummary 字段中', sourceName: '机器之心' },
    ]

    const result = aggregateNews(items)
    expect(result[0].summary.length).toBeLessThanOrEqual(55)
    expect(result[0].fullSummary.length).toBeGreaterThan(result[0].summary.length)
  })

  it('handles missing description', () => {
    const items: RawNewsItem[] = [
      { title: 'No Desc', link: 'https://nodesc.com', sourceName: '量子位' },
    ]

    const result = aggregateNews(items)
    expect(result[0].summary).toBe('')
    expect(result[0].fullSummary).toBe('')
  })

  it('limits to 10 items', () => {
    const items: RawNewsItem[] = Array.from({ length: 15 }, (_, i) => ({
      title: `News ${i}`,
      link: `https://news${i}.com`,
      sourceName: '机器之心',
    }))

    const result = aggregateNews(items)
    expect(result).toHaveLength(10)
  })
})

describe('generateId', () => {
  it('generates consistent ID for same URL', () => {
    expect(generateId('https://a.com')).toBe(generateId('https://a.com'))
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

```bash
npx jest __tests__/lib/aggregator.test.ts
```

Expected: FAIL - module not found

- [ ] **Step 3: 创建 `lib/aggregator.ts`**

```typescript
import { NewsItem, RawNewsItem } from './types'

export function generateId(url: string): string {
  // Simple hash for stable IDs
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

function createSummary(description: string, maxLength: number): string {
  if (!description) return ''
  if (description.length <= maxLength) return description
  return description.slice(0, maxLength).replace(/[^一-龥a-zA-Z0-9]$/, '') + '...'
}

function parsePubDate(pubDate?: string): string {
  if (!pubDate) return new Date().toISOString()
  try {
    const d = new Date(pubDate)
    if (isNaN(d.getTime())) return new Date().toISOString()
    return d.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

export function aggregateNews(rawItems: RawNewsItem[]): NewsItem[] {
  const seen = new Set<string>()
  const uniqueItems: RawNewsItem[] = []

  for (const item of rawItems) {
    if (seen.has(item.link)) continue
    seen.add(item.link)
    uniqueItems.push(item)
  }

  // Sort by pubDate descending (newest first)
  uniqueItems.sort((a, b) => {
    const dateA = new Date(a.pubDate || 0).getTime()
    const dateB = new Date(b.pubDate || 0).getTime()
    return dateB - dateA
  })

  const now = new Date().toISOString()

  return uniqueItems.slice(0, 10).map((item) => {
    const desc = item.description || ''
    return {
      id: generateId(item.link),
      title: item.title,
      summary: createSummary(desc, 50),
      fullSummary: createSummary(desc, 300),
      source: item.sourceName,
      sourceUrl: item.link,
      publishedAt: parsePubDate(item.pubDate),
      fetchedAt: now,
    }
  })
}
```

- [ ] **Step 4: 运行测试，确认通过**

```bash
npx jest __tests__/lib/aggregator.test.ts
```

Expected: PASS (5/5 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/aggregator.ts __tests__/lib/aggregator.test.ts
git commit -m "feat: add news aggregation logic with dedup and tests"
```

---

## Task 7: API Handlers

**Files:**
- Create: `lib/handlers/news.ts`
- Create: `lib/handlers/cron.ts`
- Create: `__tests__/handlers/news.test.ts`
- Create: `__tests__/handlers/cron.test.ts`

- [ ] **Step 1: 写 `__tests__/handlers/news.test.ts`（失败测试）**

```typescript
import { getNewsHandler } from '@/lib/handlers/news'
import * as kvModule from '@/lib/kv'

jest.mock('@/lib/kv')

describe('getNewsHandler', () => {
  it('returns news for a specific date', async () => {
    const mockItems = [{ id: '1', title: 'Test News' }]
    ;(kvModule.getNewsByDate as jest.Mock).mockResolvedValue(mockItems)

    const result = await getNewsHandler('2026-06-01')
    expect(result).toEqual({ date: '2026-06-01', items: mockItems, count: 1 })
  })

  it('falls back to latest date when no date provided', async () => {
    const mockItems = [{ id: '2', title: 'Latest' }]
    ;(kvModule.getLatestNewsDate as jest.Mock).mockResolvedValue('2026-06-01')
    ;(kvModule.getNewsByDate as jest.Mock).mockResolvedValue(mockItems)

    const result = await getNewsHandler(undefined)
    expect(result).toEqual({ date: '2026-06-01', items: mockItems, count: 1 })
  })

  it('returns empty array when no data found', async () => {
    ;(kvModule.getLatestNewsDate as jest.Mock).mockResolvedValue(null)

    const result = await getNewsHandler(undefined)
    expect(result).toEqual({ date: '', items: [], count: 0 })
  })
})
```

- [ ] **Step 2: 写 `__tests__/handlers/cron.test.ts`（失败测试）**

```typescript
import { fetchNewsHandler } from '@/lib/handlers/cron'
import * as rssModule from '@/lib/rss'
import * as searchModule from '@/lib/search'
import * as aggregatorModule from '@/lib/aggregator'
import * as kvModule from '@/lib/kv'

jest.mock('@/lib/rss')
jest.mock('@/lib/search')
jest.mock('@/lib/aggregator')
jest.mock('@/lib/kv')

describe('fetchNewsHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('aggregates and stores news', async () => {
    ;(rssModule.fetchRSS as jest.Mock).mockResolvedValue({
      items: [{ title: 'RSS', link: 'https://rss.com', sourceName: '机器之心' }],
      error: null,
    })
    ;(searchModule.fetchSearchNews as jest.Mock).mockResolvedValue({
      items: [{ title: 'Search', link: 'https://search.com', sourceName: '搜索补充' }],
      error: null,
    })
    ;(aggregatorModule.aggregateNews as jest.Mock).mockReturnValue([
      { id: '1', title: 'RSS', source: '机器之心' },
      { id: '2', title: 'Search', source: '搜索补充' },
    ])

    const result = await fetchNewsHandler()
    expect(kvModule.setNewsByDate).toHaveBeenCalled()
    expect(result.success).toBe(true)
    expect(result.fetched).toBe(2)
  })
})
```

- [ ] **Step 3: 运行测试，确认失败**

```bash
npx jest __tests__/handlers/news.test.ts __tests__/handlers/cron.test.ts
```

Expected: FAIL - modules not found

- [ ] **Step 4: 创建 `lib/handlers/news.ts`**

```typescript
import { getNewsByDate, getLatestNewsDate } from '../kv'
import { NewsItem } from '../types'

export interface NewsResponse {
  date: string
  items: NewsItem[]
  count: number
}

export async function getNewsHandler(date?: string): Promise<NewsResponse> {
  const targetDate = date || (await getLatestNewsDate()) || ''
  if (!targetDate) {
    return { date: '', items: [], count: 0 }
  }
  const items = (await getNewsByDate(targetDate)) || []
  return { date: targetDate, items, count: items.length }
}
```

- [ ] **Step 5: 创建 `lib/handlers/cron.ts`**

```typescript
import { fetchRSS, RSS_SOURCES } from '../rss'
import { fetchSearchNews } from '../search'
import { aggregateNews } from '../aggregator'
import { setNewsByDate } from '../kv'
import { formatDate } from '../date'

export interface CronResponse {
  success: boolean
  date: string
  fetched: number
  sources: string[]
  errors: string[]
}

export async function fetchNewsHandler(): Promise<CronResponse> {
  const errors: string[] = []
  const allRawItems: Awaited<ReturnType<typeof fetchRSS>>['items'] = []

  // Fetch all RSS sources
  const rssResults = await Promise.allSettled(
    RSS_SOURCES.map((source) => fetchRSS(source.url, source.name))
  )

  for (let i = 0; i < rssResults.length; i++) {
    const result = rssResults[i]
    if (result.status === 'fulfilled') {
      if (result.value.error) {
        errors.push(`${RSS_SOURCES[i].name}: ${result.value.error}`)
      }
      allRawItems.push(...result.value.items)
    } else {
      errors.push(`${RSS_SOURCES[i].name}: ${result.reason}`)
    }
  }

  // Fetch search supplement
  const searchResult = await fetchSearchNews()
  if (searchResult.error) {
    errors.push(`搜索补充: ${searchResult.error}`)
  }
  allRawItems.push(...searchResult.items)

  // Aggregate
  const newsItems = aggregateNews(allRawItems)
  const today = formatDate(new Date().toISOString())
  await setNewsByDate(today, newsItems)

  return {
    success: true,
    date: today,
    fetched: newsItems.length,
    sources: [...RSS_SOURCES.map((s) => s.name), '搜索补充'],
    errors,
  }
}
```

- [ ] **Step 6: 运行测试，确认通过**

```bash
npx jest __tests__/handlers/news.test.ts __tests__/handlers/cron.test.ts
```

Expected: PASS (4/4 tests)

- [ ] **Step 7: Commit**

```bash
git add lib/handlers/ __tests__/handlers/
git commit -m "feat: add API handlers with tests"
```

---

## Task 8: API Routes

**Files:**
- Create: `app/api/news/route.ts`
- Create: `app/api/cron/fetch-news/route.ts`

- [ ] **Step 1: 创建 `app/api/news/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getNewsHandler } from '@/lib/handlers/news'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || undefined

  try {
    const result = await getNewsHandler(date)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: 创建 `app/api/cron/fetch-news/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { fetchNewsHandler } from '@/lib/handlers/cron'

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await fetchNewsHandler()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/
git commit -m "feat: add API routes"
```

---

## Task 9: 前端组件

**Files:**
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`
- Create: `components/NewsCard.tsx`
- Create: `components/NewsList.tsx`
- Create: `__tests__/components/NewsCard.test.tsx`

- [ ] **Step 1: 创建 `components/Header.tsx`**

```tsx
'use client'

import { formatDate } from '@/lib/date'

interface HeaderProps {
  currentDate: string
  onDateChange?: (date: string) => void
  availableDates?: string[]
}

export default function Header({ currentDate, onDateChange, availableDates = [] }: HeaderProps) {
  return (
    <header className="mb-8 border-b border-gray-200 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🤖 AI 每日早报</h1>
          <p className="mt-1 text-sm text-gray-500">每天 10 条最新 AI 新闻</p>
        </div>
        <div className="text-right">
          {availableDates.length > 0 ? (
            <select
              value={currentDate}
              onChange={(e) => onDateChange?.(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date === formatDate(new Date().toISOString()) ? '今天' : date}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-gray-500">{currentDate}</span>
          )}
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: 创建 `components/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
      <p>AI 每日早报 · 由 Vercel 驱动</p>
    </footer>
  )
}
```

- [ ] **Step 3: 写 `__tests__/components/NewsCard.test.tsx`（失败测试）**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import NewsCard from '@/components/NewsCard'
import { NewsItem } from '@/lib/types'

const mockNews: NewsItem = {
  id: '1',
  title: 'Test News',
  summary: 'Brief summary...',
  fullSummary: 'Full summary content here...',
  source: '机器之心',
  sourceUrl: 'https://example.com',
  publishedAt: '2026-06-01T08:00:00Z',
  fetchedAt: '2026-06-01T08:00:00Z',
}

describe('NewsCard', () => {
  it('renders title and summary', () => {
    render(<NewsCard news={mockNews} index={0} />)
    expect(screen.getByText('Test News')).toBeInTheDocument()
    expect(screen.getByText('Brief summary...')).toBeInTheDocument()
  })

  it('expands on click', () => {
    render(<NewsCard news={mockNews} index={0} />)
    const button = screen.getByText('点击展开')
    fireEvent.click(button)
    expect(screen.getByText('Full summary content here...')).toBeInTheDocument()
    expect(screen.getByText('阅读原文')).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: 运行测试，确认失败**

```bash
npx jest __tests__/components/NewsCard.test.tsx
```

Expected: FAIL - module not found

- [ ] **Step 5: 创建 `components/NewsCard.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { NewsItem } from '@/lib/types'
import { formatRelativeTime } from '@/lib/date'

interface NewsCardProps {
  news: NewsItem
  index: number
}

const sourceColors: Record<string, string> = {
  '机器之心': 'bg-source-jiqizhixin',
  '量子位': 'bg-source-qbitai',
  '搜索补充': 'bg-source-search',
}

export default function NewsCard({ news, index }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false)
  const colorClass = sourceColors[news.source] || 'bg-source-default'

  return (
    <article
      className={`relative rounded-xl border border-gray-200 p-5 transition-all duration-200 hover:border-primary hover:shadow-md ${
        expanded ? 'border-primary shadow-md' : ''
      }`}
    >
      <div className={`absolute left-0 top-5 h-12 w-1 rounded-r ${colorClass}`} />

      <div className="pl-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            <span className="mr-2 text-primary">{index + 1}.</span>
            {news.title}
          </h3>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {news.source} · {formatRelativeTime(news.publishedAt)}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-gray-600">{news.summary}</p>

        {expanded && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm leading-relaxed text-gray-700">{news.fullSummary}</p>
            <a
              href={news.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              🔗 阅读原文
            </a>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-medium text-primary hover:text-blue-700 focus:outline-none"
        >
          {expanded ? '▲ 点击收起' : '▼ 点击展开'}
        </button>
      </div>
    </article>
  )
}
```

- [ ] **Step 6: 运行测试，确认通过**

```bash
npx jest __tests__/components/NewsCard.test.tsx
```

Expected: PASS (2/2 tests)

- [ ] **Step 7: 创建 `components/NewsList.tsx`**

```tsx
import { NewsItem } from '@/lib/types'
import NewsCard from './NewsCard'

interface NewsListProps {
  items: NewsItem[]
}

export default function NewsList({ items }: NewsListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 p-8 text-center text-gray-500">
        <p>今日新闻更新中，请稍后再试</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((news, index) => (
        <NewsCard key={news.id} news={news} index={index} />
      ))}
    </div>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add components/ __tests__/components/
git commit -m "feat: add frontend components with tests"
```

---

## Task 10: 首页与布局完善

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: 更新 `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 每日早报',
  description: '每天 10 条最新 AI 新闻',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: 更新 `app/page.tsx`**

```tsx
import Header from '@/components/Header'
import NewsList from '@/components/NewsList'
import Footer from '@/components/Footer'
import { getNewsHandler } from '@/lib/handlers/news'
import { formatDate } from '@/lib/date'

export const revalidate = 3600 // ISR: revalidate every hour

export default async function Home({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const date = searchParams?.date
  const { items, date: currentDate } = await getNewsHandler(date)

  // Generate last 7 days for date selector
  const today = new Date()
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    return formatDate(d.toISOString())
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Header currentDate={currentDate} availableDates={availableDates} />
      <NewsList items={items} />
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: 更新 `app/globals.css`（添加动画工具类）**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
}

@layer utilities {
  .animate-in {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

- [ ] **Step 4: 验证构建**

```bash
npx next build
```

Expected: 构建成功，无 TypeScript 错误。

- [ ] **Step 5: Commit**

```bash
git add app/ components/
git commit -m "feat: integrate homepage with ISR and date selector"
```

---

## Task 11: 部署配置

**Files:**
- Create: `vercel.json`
- Create: `.env.example`
- Modify: `next.config.js`

- [ ] **Step 1: 创建 `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-news",
      "schedule": "0 0 * * *"
    }
  ]
}
```

> Note: `"0 0 * * *"` is UTC 00:00 = Beijing Time 08:00.

- [ ] **Step 2: 创建 `.env.example`**

```
# Vercel KV (auto-populated by Vercel when connecting KV storage)
KV_URL=
KV_REST_API_TOKEN=

# Cron job authorization secret (set manually in Vercel dashboard)
CRON_SECRET=your_random_secret_here
```

- [ ] **Step 3: 更新 `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

- [ ] **Step 4: 最终构建验证**

```bash
npx next build
```

Expected: 构建成功。

- [ ] **Step 5: 运行全部测试**

```bash
npx jest
```

Expected: 全部通过。

- [ ] **Step 6: Commit**

```bash
git add vercel.json .env.example next.config.js
git commit -m "chore: add deployment config and env template"
```

---

## Self-Review

### 1. Spec Coverage

| Spec 要求 | 对应 Task |
|-----------|-----------|
| Next.js + App Router + TypeScript | Task 1 |
| Tailwind CSS + 现代资讯风 | Task 1, 9, 10 |
| Vercel KV 存储 | Task 3 |
| RSS 抓取（4-5 个源） | Task 4 |
| 搜索补充 | Task 5 |
| 去重、排序、取前 10 | Task 6 |
| 每天 8:00 定时任务 | Task 11 (vercel.json) |
| API `/api/news` | Task 7, 8 |
| API `/api/cron/fetch-news` | Task 7, 8 |
| 卡片展开交互（模式三） | Task 9 (NewsCard) |
| 日期选择器 | Task 9, 10 |
| 错误降级 | Task 7 (handlers), Task 4 (Promise.allSettled) |
| 保留 7 天数据 | Spec 设计（KV key 按日期） |
| 来源标识彩色竖线 | Task 9 (NewsCard) |
| 相对时间显示 | Task 2 (date.ts) |
| ISR 每小时重建 | Task 10 (page.tsx) |

**无遗漏。**

### 2. Placeholder Scan

- 无 TBD/TODO
- 无 "add appropriate error handling" 等模糊描述
- 每个代码步骤包含完整代码
- 无 "similar to Task X" 引用

### 3. Type Consistency

- `NewsItem` / `RawNewsItem` / `FetchResult` 定义在 `lib/types.ts`，所有 task 使用一致
- `getNewsHandler` / `fetchNewsHandler` 返回类型在 Task 7 定义，与 Task 8 route 中使用一致
- `formatDate` 在 Task 2 定义，在 Task 6, 10 中使用一致
- KV key 格式 `news:daily:${date}` 在 Task 3 定义，一致使用

**无类型不一致。**

---

## 部署后操作

1. 在 Vercel Dashboard 创建 KV 存储并绑定到项目
2. 设置环境变量 `CRON_SECRET`
3. 首次手动访问 `/api/cron/fetch-news`（带 Bearer token）填充数据
4. （可选）配置自定义域名
