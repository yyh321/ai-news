import { NextRequest, NextResponse } from 'next/server'
import { getNewsHandler } from '@/lib/handlers/news'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || undefined

  try {
    const result = await getNewsHandler(date)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
