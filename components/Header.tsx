'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/date'

interface HeaderProps {
  currentDate: string
  onDateChange?: (date: string) => void
  availableDates?: string[]
}

export default function Header({ currentDate, onDateChange, availableDates = [] }: HeaderProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const today = formatDate(new Date().toISOString())

  const getDateLabel = (date: string) => {
    if (date === today) return `今天 · ${date}`
    return date
  }

  const handleDateChange = (date: string) => {
    setIsOpen(false)

    if (onDateChange) {
      onDateChange(date)
      return
    }

    router.push(`/?date=${encodeURIComponent(date)}`)
  }

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

      <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            AI 每日早报
          </h1>
          <p className="mt-3 text-base text-slate-500">
            每天精选 <span className="font-semibold text-slate-700">10 条</span> 最新 AI 资讯，让你保持前沿
          </p>
        </div>

        {availableDates.length > 0 ? (
          <div className="relative w-full sm:w-auto">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400 sm:text-right">
              选择日期
            </div>
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="flex h-13 w-full items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300/70 sm:w-56"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <svg width="16" height="16" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M5 11h14M6 21h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    {getDateLabel(currentDate)}
                  </span>
                  <span className="block text-xs text-slate-400">
                    查看历史早报
                  </span>
                </span>
              </span>
              <svg
                className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl shadow-slate-200/60 backdrop-blur sm:w-56">
                <div className="max-h-72 space-y-1 overflow-auto" role="listbox">
                  {availableDates.map((date) => {
                    const isActive = date === currentDate
                    return (
                      <button
                        key={date}
                        type="button"
                        onClick={() => handleDateChange(date)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                          isActive
                            ? 'bg-slate-900 font-semibold text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        role="option"
                        aria-selected={isActive}
                      >
                        <span>{getDateLabel(date)}</span>
                        {isActive ? (
                          <svg width="16" height="16" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <span className="text-sm font-medium text-slate-500">{currentDate}</span>
        )}
      </div>

      <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </header>
  )
}
