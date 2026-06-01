import { render, screen, fireEvent } from '@testing-library/react'
import NewsCard from '@/components/NewsCard'
import { NewsItem } from '@/lib/types'

const mockNews: NewsItem = {
  id: '1',
  title: 'Test News',
  summary: 'Brief summary...',
  fullSummary: 'Full summary content here...',
  source: '机器之心',
  sourceUrl: 'https://example.com',
  publishedAt: '2026-06-01T08:00:00Z',
  fetchedAt: '2026-06-01T08:00:00Z',
}

describe('NewsCard', () => {
  it('renders title and summary', () => {
    render(<NewsCard news={mockNews} index={0} />)
    expect(screen.getByText('Test News')).toBeInTheDocument()
    expect(screen.getByText('Brief summary...')).toBeInTheDocument()
  })

  it('expands on click', () => {
    render(<NewsCard news={mockNews} index={0} />)
    const button = screen.getByText('▼ 点击展开')
    fireEvent.click(button)
    expect(screen.getByText('Full summary content here...')).toBeInTheDocument()
    expect(screen.getByText('🔗 阅读原文')).toBeInTheDocument()
  })
})
