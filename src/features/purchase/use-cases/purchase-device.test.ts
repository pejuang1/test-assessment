import { describe, it, expect } from 'vitest'
import { purchaseDevice } from './purchase-device'
import { DeviceRepository } from '@/features/product-catalog/use-cases/device-repository'
import { Device } from '@/features/product-catalog/domain/device'
import { OutOfStockError } from '../domain/purchase'
import { DeviceNotFoundError } from '@/features/product-catalog/use-cases/get-device-by-id'

class MockDeviceRepository implements DeviceRepository {
  constructor(private devices: Device[] = []) {}

  async getDevices(): Promise<Device[]> {
    return this.devices
  }

  async getDeviceById(id: string): Promise<Device | null> {
    const found = this.devices.find(d => d.id === id)
    return found ? { ...found } : null
  }
}

describe('Purchase Use Case: purchaseDevice', () => {
  const sampleDevices: Device[] = [
    { id: '1', name: 'iPhone 16 Pro', brand: 'Apple', type: 'Smartphones', price: 999, color: 'Desert Titanium', tone: 'sand', tag: 'POPULAR', storage: '128 GB', screen: '6.3-inch', chip: 'A18 Pro', camera: '48 MP', battery: 'Up to 27 hours', os: 'iOS 18', stock: 12 },
    { id: '2', name: 'Galaxy S25 Ultra', brand: 'Samsung', type: 'Smartphones', price: 1299, color: 'Titanium Gray', tone: 'gray', tag: '', storage: '256 GB', screen: '6.9-inch', chip: 'Snapdragon 8 Elite', camera: '200 MP', battery: '5,000 mAh', os: 'Android 15', stock: 12 },
    { id: '3', name: 'Zero Stock Device', brand: 'Generic', type: 'Smartphones', price: 100, color: 'Black', tone: 'gray', tag: '', storage: '64 GB', screen: '5-inch', chip: 'Chip', camera: '10 MP', battery: '3000 mAh', os: 'OS', stock: 0 },
  ]

  it('PU-01: should return success when balance is sufficient', async () => {
    const repo = new MockDeviceRepository(sampleDevices)
    const result = await purchaseDevice(repo, { deviceId: '1', balance: 1050 })

    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.total).toBe(999)
      expect(result.deviceId).toBe('1')
      expect(result.orderId).toMatch(/^ORB-\d{8}$/)
    }
  })

  it('PU-02: should return insufficient_balance without throwing when balance is too low', async () => {
    const repo = new MockDeviceRepository(sampleDevices)
    const result = await purchaseDevice(repo, { deviceId: '2', balance: 1050 })

    expect(result).toEqual({ status: 'insufficient_balance' })
  })

  it('PU-03: should throw OutOfStockError when device stock is less than 1', async () => {
    const repo = new MockDeviceRepository(sampleDevices)
    await expect(purchaseDevice(repo, { deviceId: '3', balance: 1050 })).rejects.toThrowError(OutOfStockError)
    await expect(purchaseDevice(repo, { deviceId: '3', balance: 1050 })).rejects.toThrow('This device is out of stock.')
  })

  it('PU-04: should throw DeviceNotFoundError when device does not exist', async () => {
    const repo = new MockDeviceRepository(sampleDevices)
    await expect(purchaseDevice(repo, { deviceId: '99', balance: 1050 })).rejects.toThrowError(DeviceNotFoundError)
  })
})
