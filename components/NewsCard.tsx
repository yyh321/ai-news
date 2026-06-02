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
