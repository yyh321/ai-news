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
