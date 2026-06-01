import { formatRelativeTime, formatDate } from '@/lib/date'

describe('formatRelativeTime', () => {
  it('returns "刚刚" for current time', () => {
    const now = new Date().toISOString()
    expect(formatRelativeTime(now)).toBe('刚刚')
  })

  it('returns "X分钟前" for minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(fiveMinAgo)).toBe('5分钟前')
  })

  it('returns "X小时前" for hours ago', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(twoHoursAgo)).toBe('2小时前')
  })

  it('returns "昨天" for yesterday', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(yesterday)).toBe('昨天')
  })

  it('returns "X天前" for days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(threeDaysAgo)).toBe('3天前')
  })
})

describe('formatDate', () => {
  it('formats ISO string to YYYY-MM-DD', () => {
    expect(formatDate('2026-06-01T08:00:00Z')).toBe('2026-06-01')
  })
})
