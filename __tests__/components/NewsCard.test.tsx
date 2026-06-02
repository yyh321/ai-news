import { render, screen } from '@testing-library/react'
import NewsCard from '@/components/NewsCard'
import { NewsItem } from '@/lib/types'

const mockNews: NewsItem = {
  id: '1',
  title: 'Test News',
  summary: 'Brief summary...',
  fullSummary: 'Full summary content here...',
  source: '雷峰网',
  sourceUrl: 'https://example.com',
  publishedAt: '2026-06-01T08:00:00Z',
  fetchedAt: '2026-06-01T08:00:00Z',
}

describe('NewsCard', () => {
  it('renders title as a link to sourceUrl', () => {
    render(<NewsCard news={mockNews} index={0} />)
    const link = screen.getByRole('link', { name: /Test News/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders summary directly', () => {
    render(<NewsCard news={mockNews} index={0} />)
    expect(screen.getByText('Brief summary...')).toBeInTheDocument()
  })

  it('does not render expand button', () => {
    render(<NewsCard news={mockNews} index={0} />)
    expect(screen.queryByText(/点击展开/)).not.toBeInTheDocument()
    expect(screen.queryByText(/点击收起/)).not.toBeInTheDocument()
  })
})
