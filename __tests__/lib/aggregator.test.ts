import { aggregateNews, dedupeNewsItems, generateId } from '@/lib/aggregator'
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

  it('deduplicates by normalized title', () => {
    const items: RawNewsItem[] = [
      {
        title: 'NUS 余浩泳教授：外骨骼的轻量化与任务感知 | ICRA 2026',
        link: 'https://a.com/one',
        description: 'Desc A',
        pubDate: 'Mon, 01 Jun 2026 10:00:00 GMT',
        sourceName: '雷峰网',
      },
      {
        title: 'NUS 余浩泳教授：外骨骼的轻量化与任务感知｜ICRA 2026',
        link: 'https://a.com/two',
        description: 'Desc B',
        pubDate: 'Mon, 01 Jun 2026 09:00:00 GMT',
        sourceName: '雷峰网',
      },
    ]

    const result = aggregateNews(items)
    expect(result).toHaveLength(1)
    expect(result[0].sourceUrl).toBe('https://a.com/one')
  })

  it('deduplicates already stored items by normalized title', () => {
    const result = dedupeNewsItems([
      {
        id: '1',
        title: '从&quot;各自为战&quot;到&quot;共生共筑&quot;',
        summary: 'A',
        fullSummary: 'A',
        source: '雷峰网',
        sourceUrl: 'https://a.com/one',
        publishedAt: '2026-06-01T10:00:00.000Z',
        fetchedAt: '2026-06-01T10:00:00.000Z',
      },
      {
        id: '2',
        title: '从各自为战到共生共筑',
        summary: 'B',
        fullSummary: 'B',
        source: '雷峰网',
        sourceUrl: 'https://a.com/two',
        publishedAt: '2026-06-01T09:00:00.000Z',
        fetchedAt: '2026-06-01T10:00:00.000Z',
      },
    ])

    expect(result).toHaveLength(1)
    expect(result[0].sourceUrl).toBe('https://a.com/one')
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
