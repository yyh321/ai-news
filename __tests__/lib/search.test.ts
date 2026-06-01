import { fetchSearchNews } from '@/lib/search'
import { fetchRSS } from '../../lib/rss'

jest.mock('../../lib/rss', () => ({
  fetchRSS: jest.fn(),
}))

describe('fetchSearchNews', () => {
  it('fetches news from Google News RSS', async () => {
    ;(fetchRSS as jest.Mock).mockResolvedValue({
      items: [
        { title: 'Search Result', link: 'https://news.com/1', sourceName: '搜索补充' },
      ],
      error: null,
    })

    const result = await fetchSearchNews()
    expect(fetchRSS).toHaveBeenCalled()
    expect(result.items).toHaveLength(1)
    expect(result.error).toBeNull()
  })

  it('returns empty array on error', async () => {
    ;(fetchRSS as jest.Mock).mockResolvedValue({
      items: [],
      error: 'Failed',
    })

    const result = await fetchSearchNews()
    expect(result.items).toEqual([])
    expect(result.error).toBe('Failed')
  })
})
