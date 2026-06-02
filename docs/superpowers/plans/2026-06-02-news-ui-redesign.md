# News UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the news page with a minimal card style: title links to original article, summary always visible, no expand/collapse, cleaner layout.

**Architecture:** Transform NewsCard from an interactive client component into a pure presentational server component. Update Header, NewsList, and page layout for a modern minimal aesthetic using Tailwind.

**Tech Stack:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS

---

### File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/NewsCard.tsx` | Modify | Pure card UI: title link, summary, meta badges |
| `components/NewsList.tsx` | Modify | List wrapper + empty state styling |
| `components/Header.tsx` | Modify | Title, subtitle, date selector styling |
| `app/page.tsx` | Modify | Page background and container |
| `tailwind.config.ts` | Modify | Add `source-leiphone` color if missing |
| `__tests__/components/NewsCard.test.tsx` | Modify | Remove expand/collapse tests, keep render tests |

---

### Task 1: Transform NewsCard into a presentational link card

**Files:**
- Modify: `components/NewsCard.tsx`
- Test: `__tests__/components/NewsCard.test.tsx`

- [ ] **Step 1: Write the failing test update**

Update `__tests__/components/NewsCard.test.tsx` to remove expand tests and verify the title is a link:

```typescript
import { render, screen } from '@testing-library/react'
import NewsCard from '@/components/NewsCard'
import { NewsItem } from '@/lib/types'

const mockNews: NewsItem = {
  id: '1',
  title: 'Test News',
  summary: 'Brief summary...',
  fullSummary: 'Full summary content here...',
  source: '雷峰网',
  sourceUrl: 'https://example.com',
  publishedAt: '2026-06-01T08:00:00Z',
  fetchedAt: '2026-06-01T08:00:00Z',
}

describe('NewsCard', () => {
  it('renders title as a link to sourceUrl', () => {
    render(<NewsCard news={mockNews} index={0} />)
    const link = screen.getByRole('link', { name: /Test News/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders summary directly', () => {
    render(<NewsCard news={mockNews} index={0} />)
    expect(screen.getByText('Brief summary...')).toBeInTheDocument()
  })

  it('does not render expand button', () => {
    render(<NewsCard news={mockNews} index={0} />)
    expect(screen.queryByText(/点击展开/)).not.toBeInTheDocument()
    expect(screen.queryByText(/点击收起/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/components/NewsCard.test.tsx`

Expected: FAIL because the current NewsCard still has expand button and title is not a link.

- [ ] **Step 3: Rewrite NewsCard component**

Replace the entire `components/NewsCard.tsx`:

```tsx
import { NewsItem } from '@/lib/types'
import { formatRelativeTime } from '@/lib/date'

interface NewsCardProps {
  news: NewsItem
  index: number
}

const sourceBadgeStyles: Record<string, string> = {
  '雷峰网': 'bg-blue-50 text-blue-700',
  '量子位': 'bg-emerald-50 text-emerald-700',
  '搜索补充': 'bg-amber-50 text-amber-700',
  'Synced Review': 'bg-violet-50 text-violet-700',
  'Paper Digest': 'bg-violet-50 text-violet-700',
}

export default function NewsCard({ news, index }: NewsCardProps) {
  const badgeStyle = sourceBadgeStyles[news.source] || 'bg-gray-50 text-gray-600'

  return (
    <article className="group rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <a
        href={news.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
          <span className="mr-2 text-blue-500">{index + 1}.</span>
          {news.title}
        </h3>
      </a>

      <div className="mt-2 flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyle}`}>
          {news.source}
        </span>
        <span className="text-xs text-gray-400">
          {formatRelativeTime(news.publishedAt)}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {news.summary}
      </p>
    </article>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- __tests__/components/NewsCard.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/NewsCard.tsx __tests__/components/NewsCard.test.tsx
git commit -m "feat: redesign NewsCard as a minimal link card

- Title links directly to source article
- Summary always visible, no expand/collapse
- Pure presentational component

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Update NewsList, Header, and page layout

**Files:**
- Modify: `components/NewsList.tsx`
- Modify: `components/Header.tsx`
- Modify: `app/page.tsx`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Update NewsList**

Replace `components/NewsList.tsx`:

```tsx
import { NewsItem } from '@/lib/types'
import NewsCard from './NewsCard'

interface NewsListProps {
  items: NewsItem[]
}

export default function NewsList({ items }: NewsListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-gray-400">今天的新闻还在路上，稍后再来看看吧~</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {items.map((news, index) => (
        <NewsCard key={news.id} news={news} index={index} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Update Header**

Replace `components/Header.tsx`:

```tsx
import { formatDate } from '@/lib/date'

interface HeaderProps {
  currentDate: string
  onDateChange?: (date: string) => void
  availableDates?: string[]
}

export default function Header({ currentDate, onDateChange, availableDates = [] }: HeaderProps) {
  return (
    <header className="mb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            AI 每日早报
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            每天精选 10 条最新 AI 资讯
          </p>
        </div>
        {availableDates.length > 0 ? (
          <select
            value={currentDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      <div className="mt-6 h-px bg-gradient-to-r from-blue-500/20 via-gray-200 to-transparent" />
    </header>
  )
}
```

- [ ] **Step 3: Update page layout**

Replace `app/page.tsx`:

```tsx
import Header from '@/components/Header'
import NewsList from '@/components/NewsList'
import Footer from '@/components/Footer'
import { getNewsHandler } from '@/lib/handlers/news'
import { formatDate } from '@/lib/date'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const date = searchParams?.date
  console.log('[page] searchParams date:', date)
  const { items, date: currentDate } = await getNewsHandler(date)
  console.log('[page] rendered items:', items.length, 'currentDate:', currentDate)

  const today = new Date()
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    return formatDate(d.toISOString())
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Header currentDate={currentDate} availableDates={availableDates} />
        <NewsList items={items} />
        <Footer />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify tailwind.config.ts has needed colors**

`tailwind.config.ts` already has `source-leiphone`, `source-qbitai`, `source-default`, `source-search`. No changes needed for this redesign since we moved to inline badge styles.

- [ ] **Step 5: Run all tests**

Run: `npm test`

Expected: All 8 test suites pass.

- [ ] **Step 6: Commit**

```bash
git add components/NewsList.tsx components/Header.tsx app/page.tsx
git commit -m "feat: update NewsList, Header, and page layout for minimal style

- Softer background, gradient header divider
- Styled empty state and date selector
- Cleaner page container

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Update Footer and push

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Update Footer**

Replace `components/Footer.tsx`:

```tsx
export default function Footer() {
  return (
    <footer className="mt-16 pb-10 text-center text-sm text-gray-400">
      <p>AI 每日早报 · 由 Vercel 驱动</p>
    </footer>
  )
}
```

- [ ] **Step 2: Build check**

Run: `npm run build`

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit and push**

```bash
git add components/Footer.tsx
git commit -m "feat: update Footer spacing for minimal style

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
git push origin master
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|------------------|------|
| Title links to original article | Task 1, Step 3 |
| Summary always visible | Task 1, Step 3 |
| Remove expand/collapse | Task 1, Steps 1 + 3 |
| Minimal card style (white, shadow, hover) | Task 1, Step 3 + Task 2 |
| Source badge + time meta | Task 1, Step 3 |
| Page background gray-50 | Task 2, Step 3 |
| Header gradient divider | Task 2, Step 2 |
| Friendly empty state | Task 2, Step 1 |

## Placeholder Scan

No placeholders. All code is complete and copy-paste ready.

## Type Consistency

- `NewsItem` type unchanged — all properties still referenced correctly.
- `NewsCardProps` unchanged.
- `sourceBadgeStyles` keys match current RSS source names (`雷峰网`, `量子位`, `搜索补充`, `Synced Review`, `Paper Digest`).
