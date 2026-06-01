export const metadata = {
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
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  )
}
