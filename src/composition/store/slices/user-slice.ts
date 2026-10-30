import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/features/user-profile/domain/user'

export type UserState = {
  user: User | null
  walletBalance: number
}

const initialState: UserState = {
  user: null,
  walletBalance: 1050,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.walletBalance = action.payload.walletBalance
    },
    setWalletBalance: (state, action: PayloadAction<number>) => {
      state.walletBalance = action.payload
    },
  },
})

export const { setUser, setWalletBalance } = userSlice.actions

export const selectUser = (state: { user: UserState }) => state.user.user
export const selectWalletBalance = (state: { user: UserState }) => state.user.walletBalance

export default userSlice.reducer
