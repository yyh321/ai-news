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
