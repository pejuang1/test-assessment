import { LayoutGrid, Smartphone, Tablet, Search } from 'lucide-react'
import { CATEGORY_FILTERS, CategoryFilter, SortOption } from '../../domain/device'

export type FilterToolbarProps = {
  currentCategory: CategoryFilter
  searchQuery: string
  sortBy: SortOption
  onCategoryChange: (category: CategoryFilter) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: SortOption) => void
}

export function FilterToolbar({
  currentCategory,
  searchQuery,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: FilterToolbarProps) {
  return (
    <div className="toolbar">
      <div className="tabs">
        {CATEGORY_FILTERS.map((c, i) => {
          const Icon = [LayoutGrid, Smartphone, Tablet][i]
          return (
            <button
              key={c}
              className={currentCategory === c ? 'active' : ''}
              onClick={() => onCategoryChange(c)}
            >
              <Icon size={15} />
              {c}
            </button>
          )
        })}
      </div>
      <div className="tools">
        <label className="search">
          <Search size={16} />
          <input
            aria-label="Search devices"
            placeholder="Search devices…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
        </label>
        <select
          aria-label="Sort devices"
          value={sortBy}
          onChange={e => onSortChange(e.target.value as SortOption)}
        >
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
    </div>
  )
}
