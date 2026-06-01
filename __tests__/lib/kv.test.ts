// jest.mock is hoisted to the top, but placing it first improves readability
jest.mock('@vercel/kv', () => ({
  kv: {
    get: jest.fn(),
    set: jest.fn(),
  },
}))

import { getNewsByDate, setNewsByDate, getLatestNewsDate } from '@/lib/kv'
import { kv } from '@vercel/kv'

describe('KV operations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getNewsByDate returns parsed items', async () => {
    const mockItems = [
      {
        id: '1',
        title: 'Test',
        summary: 'Summary',
        fullSummary: 'Full summary',
        source: 'Source',
        sourceUrl: 'https://example.com',
        publishedAt: '2026-06-01T00:00:00Z',
        fetchedAt: '2026-06-01T12:00:00Z',
      },
    ]
    ;(kv.get as jest.Mock).mockResolvedValue(JSON.stringify(mockItems))

    const result = await getNewsByDate('2026-06-01')
    expect(kv.get).toHaveBeenCalledWith('news:daily:2026-06-01')
    expect(result).toEqual(mockItems)
  })

  it('getNewsByDate returns null when no data', async () => {
    ;(kv.get as jest.Mock).mockResolvedValue(null)
    const result = await getNewsByDate('2026-06-01')
    expect(result).toBeNull()
  })

  it('setNewsByDate stores JSON string', async () => {
    const items = [
      {
        id: '1',
        title: 'Test',
        summary: 'Summary',
        fullSummary: 'Full summary',
        source: 'Source',
        sourceUrl: 'https://example.com',
        publishedAt: '2026-06-01T00:00:00Z',
        fetchedAt: '2026-06-01T12:00:00Z',
      },
    ]
    await setNewsByDate('2026-06-01', items)
    expect(kv.set).toHaveBeenCalledWith('news:daily:2026-06-01', JSON.stringify(items))
    expect(kv.set).toHaveBeenCalledWith('news:latest', '2026-06-01')
  })

  it('getLatestNewsDate returns date string', async () => {
    ;(kv.get as jest.Mock).mockResolvedValue('2026-06-01')
    const result = await getLatestNewsDate()
    expect(result).toBe('2026-06-01')
  })

  it('getNewsByDate returns null when JSON is invalid', async () => {
    ;(kv.get as jest.Mock).mockResolvedValue('not-json')
    const result = await getNewsByDate('2026-06-01')
    expect(result).toBeNull()
  })
})
