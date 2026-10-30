import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterToolbar } from '../filter-toolbar'

describe('FilterToolbar Component', () => {
  it('PC-16: should trigger correct callbacks on search, tab click, and sort select', () => {
    const handleCategoryChange = vi.fn()
    const handleSearchChange = vi.fn()
    const handleSortChange = vi.fn()

    render(
      <FilterToolbar
        currentCategory="All devices"
        searchQuery=""
        sortBy="featured"
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />
    )

    // Tab category click
    const smartphonesTab = screen.getByRole('button', { name: /Smartphones/i })
    fireEvent.click(smartphonesTab)
    expect(handleCategoryChange).toHaveBeenCalledWith('Smartphones')

    // Search input change
    const searchInput = screen.getByLabelText('Search devices')
    fireEvent.change(searchInput, { target: { value: 'pixel' } })
    expect(handleSearchChange).toHaveBeenCalledWith('pixel')

    // Sort select change
    const sortSelect = screen.getByLabelText('Sort devices')
    fireEvent.change(sortSelect, { target: { value: 'low' } })
    expect(handleSortChange).toHaveBeenCalledWith('low')
  })
})
