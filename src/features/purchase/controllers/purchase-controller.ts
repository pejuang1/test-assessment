import { PurchaseInput, PurchaseResult } from '../domain/purchase'
import { purchaseDevice } from '../use-cases/purchase-device'
import { createDeviceRepository } from '@/composition/registry'
import { delay } from '@/shared/lib/async'

export async function purchaseDeviceController(
  input: PurchaseInput,
  simulatedDelayMs: number = 1100
): Promise<PurchaseResult> {
  if (simulatedDelayMs > 0) {
    await delay(simulatedDelayMs)
  }
  const repository = createDeviceRepository()
  return purchaseDevice(repository, input)
}
