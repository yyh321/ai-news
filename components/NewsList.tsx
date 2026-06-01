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
