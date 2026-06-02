import { fetchRSS, RSS_SOURCES } from '../rss'
import { fetchSearchNews } from '../search'
import { aggregateNews } from '../aggregator'
import { setNewsByDate } from '../kv'
import { formatDate } from '../date'

export interface CronResponse {
  success: boolean
  date: string
  fetched: number
  sources: string[]
  errors: string[]
}

export async function fetchNewsHandler(): Promise<CronResponse> {
  const errors: string[] = []
  const allRawItems: Awaited<ReturnType<typeof fetchRSS>>['items'] = []

  console.log('[cron] Starting fetch, sources count:', RSS_SOURCES.length)

  // Fetch all RSS sources
  const rssResults = await Promise.allSettled(
    RSS_SOURCES.map((source) => fetchRSS(source.url, source.name))
  )

  for (let i = 0; i < rssResults.length; i++) {
    const result = rssResults[i]
    if (result.status === 'fulfilled') {
      console.log(`[cron] RSS ${RSS_SOURCES[i].name}: items=${result.value.items.length}, error=${result.value.error}`)
      if (result.value.error) {
        errors.push(`${RSS_SOURCES[i].name}: ${result.value.error}`)
      }
      allRawItems.push(...result.value.items)
    } else {
      console.log(`[cron] RSS ${RSS_SOURCES[i].name}: rejected=${result.reason}`)
      errors.push(`${RSS_SOURCES[i].name}: ${result.reason}`)
    }
  }

  console.log('[cron] Total raw items before search:', allRawItems.length)

  // Fetch search supplement
  const searchResult = await fetchSearchNews()
  console.log(`[cron] Search supplement: items=${searchResult.items.length}, error=${searchResult.error}`)
  if (searchResult.error) {
    errors.push(`搜索补充: ${searchResult.error}`)
  }
  allRawItems.push(...searchResult.items)

  // Aggregate
  const newsItems = aggregateNews(allRawItems)
  console.log('[cron] Aggregated items:', newsItems.length)

  const today = formatDate(new Date().toISOString())
  console.log('[cron] Writing to KV for date:', today)
  try {
    await setNewsByDate(today, newsItems)
    console.log('[cron] KV write success')
  } catch (kvErr) {
    console.error('[cron] KV write failed:', kvErr)
    throw kvErr
  }

  return {
    success: true,
    date: today,
    fetched: newsItems.length,
    sources: [...RSS_SOURCES.map((s) => s.name), '搜索补充'],
    errors,
  }
}
