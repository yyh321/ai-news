import Header from '@/components/Header'
import NewsList from '@/components/NewsList'
import Footer from '@/components/Footer'
import { getNewsHandler } from '@/lib/handlers/news'
import { formatDate } from '@/lib/date'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const date = searchParams?.date
  console.log('[page] searchParams date:', date)
  const { items, date: currentDate } = await getNewsHandler(date)
  console.log('[page] rendered items:', items.length, 'currentDate:', currentDate)

  const today = new Date()
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    return formatDate(d.toISOString())
  })

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* 装饰背景 */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-slate-200/70 via-stone-100/50 to-transparent blur-3xl" />
        <div className="absolute top-60 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-violet-200/30 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-emerald-100/40 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Header currentDate={currentDate} availableDates={availableDates} />
        <NewsList items={items} />
        <Footer />
      </div>
    </div>
  )
}
