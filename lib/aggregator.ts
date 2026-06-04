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

function normalizeText(text: string): string {
  return text
    .replace(/&(?:amp;)?nbsp;?|&#160;|&#xA0;/gi, ' ')
    .replace(/&(?:amp;)?quot;?/gi, '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function normalizeTitle(title: string): string {
  return normalizeText(title)
    .replace(/[^一-龥a-z0-9]+/gi, '')
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

export function dedupeNewsItems(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>()
  const uniqueItems: NewsItem[] = []

  for (const item of items) {
    const key = normalizeTitle(item.title) || item.sourceUrl
    if (seen.has(key)) continue
    seen.add(key)
    uniqueItems.push(item)
  }

  return uniqueItems
}

export function aggregateNews(rawItems: RawNewsItem[]): NewsItem[] {
  const seen = new Set<string>()
  const uniqueItems: RawNewsItem[] = []

  for (const item of rawItems) {
    const key = normalizeTitle(item.title) || item.link
    if (seen.has(item.link) || seen.has(key)) continue
    seen.add(item.link)
    seen.add(key)
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
