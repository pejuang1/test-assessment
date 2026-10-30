export type PurchaseInput = {
  deviceId: string
  balance: number
}

export type PurchaseSuccess = {
  status: 'success'
  orderId: string
  deviceId: string
  total: number
}

export type PurchaseInsufficientBalance = {
  status: 'insufficient_balance'
}

export type PurchaseResult = PurchaseSuccess | PurchaseInsufficientBalance

export class OutOfStockError extends Error {
  constructor() {
    super('This device is out of stock.')
    this.name = 'OutOfStockError'
  }
}
