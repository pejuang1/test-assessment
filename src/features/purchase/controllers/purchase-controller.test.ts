import { describe, it, expect, beforeEach } from 'vitest'
import { purchaseDeviceController } from './purchase-controller'
import { setDeviceRepository } from '@/composition/registry'
import { DeviceRepository } from '@/features/product-catalog/use-cases/device-repository'
import { Device } from '@/features/product-catalog/domain/device'

class FastMockDeviceRepository implements DeviceRepository {
  constructor(private devices: Device[] = []) {}
  async getDevices(): Promise<Device[]> {
    return this.devices
  }
  async getDeviceById(id: string): Promise<Device | null> {
    const found = this.devices.find(d => d.id === id)
    return found ? { ...found } : null
  }
}

describe('Purchase Controller', () => {
  const sampleDevices: Device[] = [
    { id: '1', name: 'iPhone 16 Pro', brand: 'Apple', type: 'Smartphones', price: 999, color: 'Desert Titanium', tone: 'sand', tag: 'POPULAR', storage: '128 GB', screen: '6.3-inch', chip: 'A18 Pro', camera: '48 MP', battery: 'Up to 27 hours', os: 'iOS 18', stock: 12 },
    { id: '2', name: 'Galaxy S25 Ultra', brand: 'Samsung', type: 'Smartphones', price: 1299, color: 'Titanium Gray', tone: 'gray', tag: '', storage: '256 GB', screen: '6.9-inch', chip: 'Snapdragon 8 Elite', camera: '200 MP', battery: '5,000 mAh', os: 'Android 15', stock: 12 },
  ]

  beforeEach(() => {
    setDeviceRepository(new FastMockDeviceRepository(sampleDevices))
  })

  it('PU-05: should process successful purchase via controller (with 0 delay override for test)', async () => {
    const result = await purchaseDeviceController({ deviceId: '1', balance: 1050 }, 0)
    expect(result.status).toBe('success')
  })

  it('PU-06: should return insufficient_balance via controller when balance is low', async () => {
    const result = await purchaseDeviceController({ deviceId: '2', balance: 1050 }, 0)
    expect(result.status).toBe('insufficient_balance')
  })
})
