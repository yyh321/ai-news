# News UI Redesign Design

## Goal
Make the AI news page more beautiful and improve the reading experience.

## Functional Changes

1. **Title links directly to original article** — Click news title to open `sourceUrl` in a new tab. Remove expand/collapse interaction.
2. **Show summary directly** — `summary` is always visible. `fullSummary` and expand button are removed.
3. **Remove client-side state from NewsCard** — NewsCard becomes a pure presentational component.

## Visual Design (Minimal Card Style)

### Page
- Background: `bg-gray-50`
- Container: centered, `max-w-3xl`

### NewsCard
- White background (`bg-white`), rounded-2xl, soft shadow (`shadow-sm hover:shadow-md`)
- Hover: translate-y -2px transition
- Title: `text-lg font-semibold text-gray-900`, hover turns blue with slight right shift
- Meta row: source badge (colored pill) + relative time, `text-xs text-gray-400`
- Summary: `text-sm text-gray-600 leading-relaxed`, displayed directly below title
- Remove left color bar, expand button, and fullSummary block

### Header
- Larger bold title with gradient underline accent
- Styled date selector

### NewsList
- Increased gap between cards (`space-y-5`)
- Friendly empty state message

## Files to Modify
- `components/NewsCard.tsx`
- `components/NewsList.tsx`
- `components/Header.tsx`
- `app/page.tsx`
