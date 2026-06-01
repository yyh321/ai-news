import { NewsItem, RawNewsItem } from './types'

export function generateId(url: string): string {
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

function createSummary(description: string, maxLength: number): string {
  if (!description) return ''
  if (description.length <= maxLength) return description
  return description.slice(0, maxLength).replace(/[^一-龥a-zA-Z0-9]$/, '') + '...'
}

function parsePubDate(pubDate?: string): string {
  if (!pubDate) return new Date().toISOString()
  try {
    const d = new Date(pubDate)
    if (isNaN(d.getTime())) return new Date().toISOString()
    return d.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

export function aggregateNews(rawItems: RawNewsItem[]): NewsItem[] {
  const seen = new Set<string>()
  const uniqueItems: RawNewsItem[] = []

  for (const item of rawItems) {
    if (seen.has(item.link)) continue
    seen.add(item.link)
    uniqueItems.push(item)
  }

  uniqueItems.sort((a, b) => {
    const dateA = new Date(a.pubDate || 0).getTime()
    const dateB = new Date(b.pubDate || 0).getTime()
    return dateB - dateA
  })

  const now = new Date().toISOString()

  return uniqueItems.slice(0, 10).map((item) => {
    const desc = item.description || ''
    return {
      id: generateId(item.link),
      title: item.title,
      summary: createSummary(desc, 50),
      fullSummary: createSummary(desc, 300),
      source: item.sourceName,
      sourceUrl: item.link,
      publishedAt: parsePubDate(item.pubDate),
      fetchedAt: now,
    }
  })
}
