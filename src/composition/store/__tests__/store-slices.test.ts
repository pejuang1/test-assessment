import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import userReducer, { setUser, selectUser, selectWalletBalance } from '../slices/user-slice'
import deviceCatalogReducer, { setDevices, setCatalogLoading, setCatalogError, selectDevices, selectCatalogLoading, selectCatalogError } from '../slices/device-catalog-slice'
import deviceFilterReducer, { setCategory, setSearch, setSortBy, selectFilteredDevices } from '../slices/device-filter-slice'
import ordersReducer, { addOrder, selectOrders } from '../slices/orders-slice'
import { Device } from '@/features/product-catalog/domain/device'
import { User } from '@/features/user-profile/domain/user'
import { PurchaseSuccess } from '@/features/purchase/domain/purchase'

function setupTestStore() {
  return configureStore({
    reducer: {
      user: userReducer,
      deviceCatalog: deviceCatalogReducer,
      deviceFilter: deviceFilterReducer,
      orders: ordersReducer,
    },
  })
}

const sampleDevices: Device[] = [
  { id: '1', name: 'iPhone 16 Pro', brand: 'Apple', type: 'Smartphones', price: 999, color: 'Desert Titanium', tone: 'sand', tag: 'POPULAR', storage: '128 GB', screen: '6.3-inch', chip: 'A18 Pro', camera: '48 MP', battery: 'Up to 27 hours', os: 'iOS 18', stock: 12 },
  { id: '2', name: 'Galaxy S25 Ultra', brand: 'Samsung', type: 'Smartphones', price: 1299, color: 'Titanium Gray', tone: 'gray', tag: 'NEW ARRIVAL', storage: '256 GB', screen: '6.9-inch', chip: 'Snapdragon 8 Elite', camera: '200 MP', battery: '5,000 mAh', os: 'Android 15', stock: 12 },
  { id: '3', name: 'iPad Air', brand: 'Apple', type: 'Tablets', price: 599, color: 'Sky Blue', tone: 'blue', tag: '', storage: '128 GB', screen: '11-inch', chip: 'Apple M3', camera: '12 MP', battery: 'Up to 10 hours', os: 'iPadOS 18', stock: 12 },
]

describe('Store Slices', () => {
  it('user-slice: sets user and updates wallet balance', () => {
    const store = setupTestStore()
    expect(selectWalletBalance(store.getState())).toBe(1050)

    const user: User = {
      id: 1,
      firstName: 'Dilan',
      lastName: 'Morgan',
      email: 'dilan.1995@email.com',
      membership: 'Orbit Plus',
      walletBalance: 1200,
    }
    store.dispatch(setUser(user))
    expect(selectUser(store.getState())).toEqual(user)
    expect(selectWalletBalance(store.getState())).toBe(1200)
  })

  it('device-catalog-slice: manages devices, loading, and error states', () => {
    const store = setupTestStore()
    store.dispatch(setDevices(sampleDevices))
    expect(selectDevices(store.getState())).toHaveLength(3)

    store.dispatch(setCatalogLoading(false))
    expect(selectCatalogLoading(store.getState())).toBe(false)

    store.dispatch(setCatalogError('Failed to load'))
    expect(selectCatalogError(store.getState())).toBe('Failed to load')
  })

  it('device-filter-slice: selectFilteredDevices combines category, search, and sort', () => {
    const store = setupTestStore()
    store.dispatch(setDevices(sampleDevices))

    // Default: all 3 devices
    expect(selectFilteredDevices(store.getState())).toHaveLength(3)

    // Filter Tablets
    store.dispatch(setCategory('Tablets'))
    expect(selectFilteredDevices(store.getState())).toHaveLength(1)
    expect(selectFilteredDevices(store.getState())[0].id).toBe('3')

    // Reset category and search 'Pro'
    store.dispatch(setCategory('All devices'))
    store.dispatch(setSearch('Pro'))
    expect(selectFilteredDevices(store.getState())).toHaveLength(1)
    expect(selectFilteredDevices(store.getState())[0].name).toBe('iPhone 16 Pro')

    // Sort by price high to low
    store.dispatch(setSearch(''))
    store.dispatch(setSortBy('high'))
    const sorted = selectFilteredDevices(store.getState())
    expect(sorted[0].price).toBe(1299)
    expect(sorted[2].price).toBe(599)
  })

  it('orders-slice: records completed purchase orders', () => {
    const store = setupTestStore()
    const order: PurchaseSuccess = {
      status: 'success',
      orderId: 'ORB-88776655',
      deviceId: '1',
      total: 999,
    }
    store.dispatch(addOrder(order))
    expect(selectOrders(store.getState())).toHaveLength(1)
    expect(selectOrders(store.getState())[0]).toEqual(order)
  })
})
