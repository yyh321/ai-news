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
