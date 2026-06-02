import { formatDate } from '@/lib/date'

interface HeaderProps {
  currentDate: string
  onDateChange?: (date: string) => void
  availableDates?: string[]
}

export default function Header({ currentDate, onDateChange, availableDates = [] }: HeaderProps) {
  return (
    <header className="mb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            AI 每日早报
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            每天精选 10 条最新 AI 资讯
          </p>
        </div>
        {availableDates.length > 0 ? (
          <select
            value={currentDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date === formatDate(new Date().toISOString()) ? '今天' : date}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm text-gray-500">{currentDate}</span>
        )}
      </div>
      <div className="mt-6 h-px bg-gradient-to-r from-blue-500/20 via-gray-200 to-transparent" />
    </header>
  )
}
