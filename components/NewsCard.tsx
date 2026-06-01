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
