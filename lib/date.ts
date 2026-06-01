export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return '未知时间'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return '刚刚'

  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHour < 24) return `${diffHour}小时前`
  if (diffDay === 1) return '昨天'
  return `${diffDay}天前`
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString)
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}
