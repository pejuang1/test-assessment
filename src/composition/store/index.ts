import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user-slice'
import deviceCatalogReducer from './slices/device-catalog-slice'
import deviceFilterReducer from './slices/device-filter-slice'
import ordersReducer from './slices/orders-slice'

export function makeStore() {
  return configureStore({
    reducer: {
      user: userReducer,
      deviceCatalog: deviceCatalogReducer,
      deviceFilter: deviceFilterReducer,
      orders: ordersReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
