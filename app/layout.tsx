import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 每日早报',
  description: '每天 10 条最新 AI 新闻',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
