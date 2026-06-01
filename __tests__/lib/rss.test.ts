import { parseRSS, fetchRSS, RSS_SOURCES, stripHtml } from '@/lib/rss'

// Mock fetch globally
global.fetch = jest.fn()

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<p>Hello</p>')).toBe('Hello')
  })

  it('normalizes whitespace', () => {
    expect(stripHtml('  a   b  ')).toBe('a b')
  })
})

describe('parseRSS', () => {
  it('parses RSS XML into RawNewsItem array', () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel>
        <item>
          <title>Test Title</title>
          <link>https://example.com/1</link>
          <description>Test Description</description>
          <pubDate>Mon, 01 Jun 2026 08:00:00 GMT</pubDate>
        </item>
      </channel></rss>
    `
    const result = parseRSS(xml, 'TestSource')
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      title: 'Test Title',
      link: 'https://example.com/1',
      description: 'Test Description',
      sourceName: 'TestSource',
    })
  })

  it('strips HTML from description', () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel>
        <item>
          <title>HTML Desc</title>
          <link>https://example.com/2</link>
          <description><p>Paragraph text</p></description>
        </item>
      </channel></rss>
    `
    const result = parseRSS(xml, 'TestSource')
    expect(result[0].description).toBe('Paragraph text')
  })

  it('handles CDATA in title and description', () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel>
        <item>
          <title><![CDATA[CDATA Title]]></title>
          <link>https://example.com/3</link>
          <description><![CDATA[<p>CDATA Desc</p>]]></description>
        </item>
      </channel></rss>
    `
    const result = parseRSS(xml, 'TestSource')
    expect(result[0].title).toBe('CDATA Title')
    expect(result[0].description).toBe('CDATA Desc')
  })

  it('handles items without description', () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel>
        <item>
          <title>No Desc</title>
          <link>https://example.com/4</link>
        </item>
      </channel></rss>
    `
    const result = parseRSS(xml, 'TestSource')
    expect(result[0].description).toBeUndefined()
  })
})

describe('fetchRSS', () => {
  it('fetches and parses RSS feed', async () => {
    const xml = `<?xml version="1.0"?>
      <rss><channel><item>
        <title>News</title><link>https://x.com</link>
      </item></channel></rss>
    `
    ;(fetch as jest.Mock).mockResolvedValue({
      text: () => Promise.resolve(xml),
      ok: true,
    })

    const result = await fetchRSS('https://example.com/rss', 'TestSource')
    expect(result.items).toHaveLength(1)
    expect(result.error).toBeNull()
  })

  it('returns error on failed fetch', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    })

    const result = await fetchRSS('https://example.com/rss', 'TestSource')
    expect(result.items).toEqual([])
    expect(result.error).toContain('404')
  })

  it('returns error on network failure', async () => {
    ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const result = await fetchRSS('https://example.com/rss', 'TestSource')
    expect(result.items).toEqual([])
    expect(result.error).toBe('Network error')
  })
})

describe('RSS_SOURCES', () => {
  it('has 4 sources configured', () => {
    expect(RSS_SOURCES).toHaveLength(4)
    expect(RSS_SOURCES[0].name).toBe('机器之心')
    expect(RSS_SOURCES[1].name).toBe('量子位')
  })
})
