import { NewsItem } from '@/lib/types'
import { formatRelativeTime } from '@/lib/date'

interface NewsCardProps {
  news: NewsItem
  index: number
}

const sourceBadgeStyles: Record<string, { badge: string; accent: string }> = {
  '雷峰网': {
    badge: 'bg-blue-50 text-blue-700 ring-blue-100',
    accent: 'from-blue-400 to-blue-600',
  },
  '量子位': {
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    accent: 'from-emerald-400 to-emerald-600',
  },
  '搜索补充': {
    badge: 'bg-amber-50 text-amber-700 ring-amber-100',
    accent: 'from-amber-400 to-amber-600',
  },
  'Synced Review': {
    badge: 'bg-violet-50 text-violet-700 ring-violet-100',
    accent: 'from-violet-400 to-violet-600',
  },
  'Paper Digest': {
    badge: 'bg-violet-50 text-violet-700 ring-violet-100',
    accent: 'from-violet-400 to-violet-600',
  },
}

const defaultStyle = {
  badge: 'bg-slate-50 text-slate-600 ring-slate-100',
  accent: 'from-slate-400 to-slate-600',
}

export default function NewsCard({ news, index }: NewsCardProps) {
  const style = sourceBadgeStyles[news.source] || defaultStyle

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]">
      {/* 左侧渐变色条 */}
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${style.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <a
        href={news.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex items-start gap-4">
          {/* 序号 */}
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-sm font-bold text-slate-600 ring-1 ring-slate-200/60 transition-all duration-300 group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white group-hover:ring-blue-500/20">
            {index + 1}
          </span>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
              {news.title}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.badge}`}>
                {news.source}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <svg className="h-3 w-3 flex-shrink-0" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatRelativeTime(news.publishedAt)}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {news.summary}
            </p>

            <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-all duration-200 group-hover:gap-2 group-hover:text-blue-600">
              阅读全文
              <svg className="h-3 w-3 flex-shrink-0" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </article>
  )
}
