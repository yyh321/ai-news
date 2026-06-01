'use client'

import { formatDate } from '@/lib/date'

interface HeaderProps {
  currentDate: string
  onDateChange?: (date: string) => void
  availableDates?: string[]
}

export default function Header({ currentDate, onDateChange, availableDates = [] }: HeaderProps) {
  return (
    <header className="mb-8 border-b border-gray-200 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🤖 AI 每日早报</h1>
          <p className="mt-1 text-sm text-gray-500">每天 10 条最新 AI 新闻</p>
        </div>
        <div className="text-right">
          {availableDates.length > 0 ? (
            <select
              value={currentDate}
              onChange={(e) => onDateChange?.(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
      </div>
    </header>
  )
}
