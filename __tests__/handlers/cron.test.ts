jest.mock('@vercel/kv', () => ({
  kv: { get: jest.fn(), set: jest.fn() },
}))

import { fetchNewsHandler } from '../../lib/handlers/cron'
import * as rssModule from '../../lib/rss'
import * as searchModule from '../../lib/search'
import * as aggregatorModule from '../../lib/aggregator'
import * as kvModule from '../../lib/kv'

jest.mock('../../lib/rss')
jest.mock('../../lib/search')
jest.mock('../../lib/aggregator')
jest.mock('../../lib/kv')

describe('fetchNewsHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('aggregates and stores news', async () => {
    ;(rssModule.fetchRSS as jest.Mock).mockResolvedValue({
      items: [
        { title: 'RSS', link: 'https://rss.com', sourceName: '机器之心' },
      ],
      error: null,
    })
    ;(searchModule.fetchSearchNews as jest.Mock).mockResolvedValue({
      items: [
        { title: 'Search', link: 'https://search.com', sourceName: '搜索补充' },
      ],
      error: null,
    })
    ;(aggregatorModule.aggregateNews as jest.Mock).mockReturnValue([
      { id: '1', title: 'RSS', source: '机器之心' },
      { id: '2', title: 'Search', source: '搜索补充' },
    ])

    const result = await fetchNewsHandler()
    expect(kvModule.setNewsByDate).toHaveBeenCalled()
    expect(result.success).toBe(true)
    expect(result.fetched).toBe(2)
  })
})
