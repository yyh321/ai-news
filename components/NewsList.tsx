import { NewsItem } from '@/lib/types'
import NewsCard from './NewsCard'

interface NewsListProps {
  items: NewsItem[]
}

export default function NewsList({ items }: NewsListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-16 text-center backdrop-blur">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <svg className="h-6 w-6 text-slate-400" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <p className="text-slate-500">今天的新闻还在路上</p>
        <p className="mt-1 text-sm text-slate-400">稍后再来看看吧 ~</p>
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
