import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import {
  CategoryFilter,
  SortOption,
  filterByCategory,
  searchDevices,
  sortDevices,
} from '@/features/product-catalog/domain/device'
import { selectDevices } from './device-catalog-slice'

export type DeviceFilterState = {
  category: CategoryFilter
  search: string
  sortBy: SortOption
}

const initialState: DeviceFilterState = {
  category: 'All devices',
  search: '',
  sortBy: 'featured',
}

export const deviceFilterSlice = createSlice({
  name: 'deviceFilter',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<CategoryFilter>) => {
      state.category = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload
    },
  },
})

export const { setCategory, setSearch, setSortBy } = deviceFilterSlice.actions

export const selectCategory = (state: { deviceFilter: DeviceFilterState }) =>
  state.deviceFilter.category
export const selectSearch = (state: { deviceFilter: DeviceFilterState }) =>
  state.deviceFilter.search
export const selectSortBy = (state: { deviceFilter: DeviceFilterState }) =>
  state.deviceFilter.sortBy

export const selectFilteredDevices = createSelector(
  [selectDevices, selectCategory, selectSearch, selectSortBy],
  (devices, category, search, sortBy) => {
    let result = filterByCategory(devices, category)
    result = searchDevices(result, search)
    result = sortDevices(result, sortBy)
    return result
  }
)

export default deviceFilterSlice.reducer
