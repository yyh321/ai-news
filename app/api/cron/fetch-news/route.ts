import { NextRequest, NextResponse } from 'next/server'
import { fetchNewsHandler } from '@/lib/handlers/cron'

export async function GET(request: NextRequest) {
  console.log('[api/cron] received request')
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('[api/cron] unauthorized')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await fetchNewsHandler()
    console.log('[api/cron] success, fetched:', result.fetched)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[api/cron] handler error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
