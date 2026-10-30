import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PurchaseSuccess } from '@/features/purchase/domain/purchase'

export type OrdersState = {
  orders: PurchaseSuccess[]
}

const initialState: OrdersState = {
  orders: [],
}

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<PurchaseSuccess>) => {
      state.orders.push(action.payload)
    },
  },
})

export const { addOrder } = ordersSlice.actions

export const selectOrders = (state: { orders: OrdersState }) => state.orders.orders

export default ordersSlice.reducer
