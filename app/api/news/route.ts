import { NextRequest, NextResponse } from 'next/server'
import { getNewsHandler } from '@/lib/handlers/news'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || undefined
  console.log('[api/news] query date:', date)

  try {
    const result = await getNewsHandler(date)
    console.log('[api/news] response:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[api/news] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
