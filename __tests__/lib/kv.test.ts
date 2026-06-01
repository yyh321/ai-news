import { getNewsByDate, setNewsByDate, getLatestNewsDate } from '@/lib/kv'

jest.mock('@vercel/kv', () => ({
  kv: {
    get: jest.fn(),
    set: jest.fn(),
  },
}))

import { kv } from '@vercel/kv'

describe('KV operations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getNewsByDate returns parsed items', async () => {
    const mockItems = [{ id: '1', title: 'Test' }]
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
    const items = [{ id: '1', title: 'Test' }]
    await setNewsByDate('2026-06-01', items)
    expect(kv.set).toHaveBeenCalledWith('news:daily:2026-06-01', JSON.stringify(items))
    expect(kv.set).toHaveBeenCalledWith('news:latest', '2026-06-01')
  })

  it('getLatestNewsDate returns date string', async () => {
    ;(kv.get as jest.Mock).mockResolvedValue('2026-06-01')
    const result = await getLatestNewsDate()
    expect(result).toBe('2026-06-01')
  })
})
