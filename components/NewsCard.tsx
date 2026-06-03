import { NewsItem } from '@/lib/types'
import { formatRelativeTime } from '@/lib/date'

interface NewsCardProps {
  news: NewsItem
  index: number
}

const sourceBadgeStyles: Record<string, string> = {
  '雷峰网': 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100',
  '量子位': 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100',
  '搜索补充': 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100',
  'Synced Review': 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100',
  'Paper Digest': 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100',
}

export default function NewsCard({ news, index }: NewsCardProps) {
  const badge = sourceBadgeStyles[news.source] || 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-100'

  return (
    <article className="group relative rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <a
        href={news.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <h3 className="text-base font-semibold leading-relaxed text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:text-lg">
          <span className="mr-2 inline-block text-sm font-bold tabular-nums text-blue-500">
            {String(index + 1).padStart(2, '0')}
          </span>
          {news.title}
        </h3>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badge}`}>
            {news.source}
          </span>
          <span className="text-xs text-slate-400">
            {formatRelativeTime(news.publishedAt)}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {news.summary}
        </p>
      </a>
    </article>
  )
}
