import { getNewsByDate, getLatestNewsDate } from '../kv'
import { NewsItem } from '../types'

export interface NewsResponse {
  date: string
  items: NewsItem[]
  count: number
}

export async function getNewsHandler(date?: string): Promise<NewsResponse> {
  console.log('[news] requested date:', date)
  const latestDate = await getLatestNewsDate()
  console.log('[news] latestDate from KV:', latestDate)
  const targetDate = date || latestDate || ''
  if (!targetDate) {
    console.log('[news] no targetDate, returning empty')
    return { date: '', items: [], count: 0 }
  }
  const items = (await getNewsByDate(targetDate)) || []
  console.log('[news] items for', targetDate, ':', items.length)
  return { date: targetDate, items, count: items.length }
}
