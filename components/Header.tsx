'use client'

import { formatDate } from '@/lib/date'

interface HeaderProps {
  currentDate: string
  onDateChange?: (date: string) => void
  availableDates?: string[]
}

export default function Header({ currentDate, onDateChange, availableDates = [] }: HeaderProps) {
  const today = formatDate(new Date().toISOString())

  return (
    <header className="mb-12">
      {/* 顶部标识 */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        Daily AI Briefing
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            AI 每日早报
          </h1>
          <p className="mt-3 text-base text-slate-500">
            每天精选 <span className="font-semibold text-slate-700">10 条</span> 最新 AI 资讯，让你保持前沿
          </p>
        </div>

        {availableDates.length > 0 ? (
          <div className="relative">
            <select
              value={currentDate}
              onChange={(e) => onDateChange?.(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition-all hover:border-slate-300 hover:shadow focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/40"
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date === today ? `今天 · ${date}` : date}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : (
          <span className="text-sm font-medium text-slate-500">{currentDate}</span>
        )}
      </div>

      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </header>
  )
}
