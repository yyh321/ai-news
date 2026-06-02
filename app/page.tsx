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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Header currentDate={currentDate} availableDates={availableDates} />
        <NewsList items={items} />
        <Footer />
      </div>
    </div>
  )
}
