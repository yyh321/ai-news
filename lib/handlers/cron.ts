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

  // Fetch all RSS sources
  const rssResults = await Promise.allSettled(
    RSS_SOURCES.map((source) => fetchRSS(source.url, source.name))
  )

  for (let i = 0; i < rssResults.length; i++) {
    const result = rssResults[i]
    if (result.status === 'fulfilled') {
      if (result.value.error) {
        errors.push(`${RSS_SOURCES[i].name}: ${result.value.error}`)
      }
      allRawItems.push(...result.value.items)
    } else {
      errors.push(`${RSS_SOURCES[i].name}: ${result.reason}`)
    }
  }

  // Fetch search supplement
  const searchResult = await fetchSearchNews()
  if (searchResult.error) {
    errors.push(`搜索补充: ${searchResult.error}`)
  }
  allRawItems.push(...searchResult.items)

  // Aggregate
  const newsItems = aggregateNews(allRawItems)
  const today = formatDate(new Date().toISOString())
  await setNewsByDate(today, newsItems)

  return {
    success: true,
    date: today,
    fetched: newsItems.length,
    sources: [...RSS_SOURCES.map((s) => s.name), '搜索补充'],
    errors,
  }
}
