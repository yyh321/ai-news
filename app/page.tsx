import Header from '@/components/Header'
import NewsList from '@/components/NewsList'
import Footer from '@/components/Footer'
import { getNewsHandler } from '@/lib/handlers/news'
import { formatDate } from '@/lib/date'

export default async function Home({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const date = searchParams?.date
  const { items, date: currentDate } = await getNewsHandler(date)

  // Generate last 7 days for date selector
  const today = new Date()
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    return formatDate(d.toISOString())
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Header currentDate={currentDate} availableDates={availableDates} />
      <NewsList items={items} />
      <Footer />
    </div>
  )
}
