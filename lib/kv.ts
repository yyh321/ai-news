import { kv } from '@vercel/kv'
import { NewsItem } from './types'

export async function getNewsByDate(date: string): Promise<NewsItem[] | null> {
  const data = await kv.get<string>(`news:daily:${date}`)
  console.log('[kv] getNewsByDate key=news:daily:' + date, 'type=', typeof data, 'isArray=', Array.isArray(data), 'value=', data ? (Array.isArray(data) ? 'array-length=' + data.length : String(data).slice(0, 100)) : 'null')
  if (!data) return null
  try {
    if (typeof data === 'string') {
      return JSON.parse(data) as NewsItem[]
    }
    return data as unknown as NewsItem[]
  } catch {
    return null
  }
}

export async function setNewsByDate(date: string, items: NewsItem[]): Promise<void> {
  await kv.set(`news:daily:${date}`, JSON.stringify(items))
  await kv.set('news:latest', date)
}

export async function getLatestNewsDate(): Promise<string | null> {
  const val = await kv.get<string>('news:latest')
  console.log('[kv] getLatestNewsDate type=', typeof val, 'value=', val)
  return val
}
