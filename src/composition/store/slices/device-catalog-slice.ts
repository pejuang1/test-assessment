import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Device } from '@/features/product-catalog/domain/device'

export type DeviceCatalogState = {
  devices: Device[]
  loading: boolean
  error: string
}

const initialState: DeviceCatalogState = {
  devices: [],
  loading: true,
  error: '',
}

export const deviceCatalogSlice = createSlice({
  name: 'deviceCatalog',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload
    },
    setCatalogLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setCatalogError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
})

export const { setDevices, setCatalogLoading, setCatalogError } = deviceCatalogSlice.actions

export const selectDevices = (state: { deviceCatalog: DeviceCatalogState }) =>
  state.deviceCatalog.devices
export const selectCatalogLoading = (state: { deviceCatalog: DeviceCatalogState }) =>
  state.deviceCatalog.loading
export const selectCatalogError = (state: { deviceCatalog: DeviceCatalogState }) =>
  state.deviceCatalog.error

export default deviceCatalogSlice.reducer
