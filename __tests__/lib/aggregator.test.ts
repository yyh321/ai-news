import { aggregateNews, generateId } from '@/lib/aggregator'
import { RawNewsItem } from '@/lib/types'

describe('aggregateNews', () => {
  it('deduplicates by URL and returns top 10', () => {
    const items: RawNewsItem[] = [
      {
        title: 'A',
        link: 'https://a.com',
        description: 'Desc A content here',
        pubDate: 'Mon, 01 Jun 2026 10:00:00 GMT',
        sourceName: '机器之心',
      },
      {
        title: 'B',
        link: 'https://b.com',
        description: 'Desc B',
        pubDate: 'Mon, 01 Jun 2026 09:00:00 GMT',
        sourceName: '量子位',
      },
      {
        title: 'A-dup',
        link: 'https://a.com',
        description: 'Desc A dup',
        pubDate: 'Mon, 01 Jun 2026 08:00:00 GMT',
        sourceName: '机器之心',
      },
    ]

    const result = aggregateNews(items)
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('A')
    expect(result[1].title).toBe('B')
  })

  it('generates summary and fullSummary', () => {
    const items: RawNewsItem[] = [
      {
        title: 'Test',
        link: 'https://test.com',
        description:
          '这是一段很长的描述文字，用来测试摘要生成功能，确保能够正确截取前五十个字作为简要摘要，完整描述则保留在 fullSummary 字段中',
        sourceName: '机器之心',
      },
    ]

    const result = aggregateNews(items)
    expect(result[0].summary.length).toBeLessThanOrEqual(55)
    expect(result[0].fullSummary.length).toBeGreaterThan(result[0].summary.length)
  })

  it('handles missing description', () => {
    const items: RawNewsItem[] = [
      { title: 'No Desc', link: 'https://nodesc.com', sourceName: '量子位' },
    ]

    const result = aggregateNews(items)
    expect(result[0].summary).toBe('')
    expect(result[0].fullSummary).toBe('')
  })

  it('limits to 10 items', () => {
    const items: RawNewsItem[] = Array.from({ length: 15 }, (_, i) => ({
      title: `News ${i}`,
      link: `https://news${i}.com`,
      sourceName: '机器之心',
    }))

    const result = aggregateNews(items)
    expect(result).toHaveLength(10)
  })

  it('sorts by pubDate descending', () => {
    const items: RawNewsItem[] = [
      {
        title: 'Older',
        link: 'https://older.com',
        pubDate: 'Mon, 01 Jun 2026 08:00:00 GMT',
        sourceName: '机器之心',
      },
      {
        title: 'Newer',
        link: 'https://newer.com',
        pubDate: 'Mon, 01 Jun 2026 10:00:00 GMT',
        sourceName: '量子位',
      },
    ]

    const result = aggregateNews(items)
    expect(result[0].title).toBe('Newer')
    expect(result[1].title).toBe('Older')
  })
})

describe('generateId', () => {
  it('generates consistent ID for same URL', () => {
    expect(generateId('https://a.com')).toBe(generateId('https://a.com'))
  })

  it('generates different IDs for different URLs', () => {
    expect(generateId('https://a.com')).not.toBe(generateId('https://b.com'))
  })
})
