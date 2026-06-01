jest.mock('@vercel/kv', () => ({
  kv: { get: jest.fn(), set: jest.fn() },
}))

import { getNewsHandler } from '../../lib/handlers/news'
import * as kvModule from '../../lib/kv'

jest.mock('../../lib/kv')

describe('getNewsHandler', () => {
  it('returns news for a specific date', async () => {
    const mockItems = [{ id: '1', title: 'Test News' }]
    ;(kvModule.getNewsByDate as jest.Mock).mockResolvedValue(mockItems)

    const result = await getNewsHandler('2026-06-01')
    expect(result).toEqual({ date: '2026-06-01', items: mockItems, count: 1 })
  })

  it('falls back to latest date when no date provided', async () => {
    const mockItems = [{ id: '2', title: 'Latest' }]
    ;(kvModule.getLatestNewsDate as jest.Mock).mockResolvedValue('2026-06-01')
    ;(kvModule.getNewsByDate as jest.Mock).mockResolvedValue(mockItems)

    const result = await getNewsHandler(undefined)
    expect(result).toEqual({ date: '2026-06-01', items: mockItems, count: 1 })
  })

  it('returns empty array when no data found', async () => {
    ;(kvModule.getLatestNewsDate as jest.Mock).mockResolvedValue(null)

    const result = await getNewsHandler(undefined)
    expect(result).toEqual({ date: '', items: [], count: 0 })
  })
})
