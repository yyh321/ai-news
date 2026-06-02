import { RawNewsItem } from './types'

export interface FetchRSSResult {
  items: RawNewsItem[]
  error: string | null
}

export const RSS_SOURCES = [
  { name: '雷峰网', url: 'https://www.leiphone.com/feed', color: 'source-leiphone' },
  { name: '量子位', url: 'https://www.qbitai.com/feed', color: 'source-qbitai' },
  { name: 'Synced Review', url: 'https://syncedreview.com/feed/', color: 'source-default' },
  { name: 'Paper Digest', url: 'https://www.paperdigest.org/feed/', color: 'source-default' },
]

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export function parseRSS(xml: string, sourceName: string): RawNewsItem[] {
  const items: RawNewsItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    const titleMatch =
      itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]>\s*<\/title>/) ||
      itemXml.match(/<title>([\s\S]*?)\s*<\/title>/)
    const linkMatch = itemXml.match(/<link>([\s\S]*?)\s*<\/link>/)
    const descMatch =
      itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/) ||
      itemXml.match(/<description>([\s\S]*?)\s*<\/description>/)
    const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)\s*<\/pubDate>/)

    if (titleMatch && linkMatch) {
      items.push({
        title: stripHtml(titleMatch[1].trim()),
        link: stripHtml(linkMatch[1].trim()),
        description: descMatch ? stripHtml(descMatch[1].trim()) : undefined,
        pubDate: dateMatch ? stripHtml(dateMatch[1].trim()) : undefined,
        sourceName,
      })
    }
  }

  return items
}

export async function fetchRSS(url: string, sourceName: string): Promise<FetchRSSResult> {
  try {
    const response = await fetch(url, { next: { revalidate: 0 } })
    if (!response.ok) {
      return { items: [], error: `HTTP ${response.status}` }
    }
    const xml = await response.text()
    const items = parseRSS(xml, sourceName)
    return { items, error: null }
  } catch (err) {
    return { items: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
