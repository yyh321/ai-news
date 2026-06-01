import { fetchRSS } from './rss'
import { FetchRSSResult } from './rss'

const GOOGLE_NEWS_RSS =
  'https://news.google.com/rss/search?q=AI+artificial+intelligence&hl=zh-CN&gl=CN&ceid=CN:zh-Hans'

export async function fetchSearchNews(): Promise<FetchRSSResult> {
  return fetchRSS(GOOGLE_NEWS_RSS, '搜索补充')
}
