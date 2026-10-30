import { DeviceRepository } from '@/features/product-catalog/use-cases/device-repository'
import { getDeviceById } from '@/features/product-catalog/use-cases/get-device-by-id'
import { PurchaseInput, PurchaseResult, OutOfStockError } from '../domain/purchase'

export async function purchaseDevice(
  repository: DeviceRepository,
  input: PurchaseInput
): Promise<PurchaseResult> {
  const device = await getDeviceById(repository, input.deviceId)

  if (device.stock < 1) {
    throw new OutOfStockError()
  }

  if (device.price > input.balance) {
    return { status: 'insufficient_balance' }
  }

  const orderId = 'ORB-' + Date.now().toString().slice(-8)

  return {
    status: 'success',
    orderId,
    deviceId: device.id,
    total: device.price,
  }
}
