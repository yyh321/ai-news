import { kv } from '@vercel/kv'
import { NewsItem } from './types'

export async function getNewsByDate(date: string): Promise<NewsItem[] | null> {
  const data = await kv.get<string>(`news:daily:${date}`)
  if (!data) return null
  return JSON.parse(data) as NewsItem[]
}

export async function setNewsByDate(date: string, items: NewsItem[]): Promise<void> {
  await kv.set(`news:daily:${date}`, JSON.stringify(items))
  await kv.set('news:latest', date)
}

export async function getLatestNewsDate(): Promise<string | null> {
  return kv.get<string>('news:latest')
}
