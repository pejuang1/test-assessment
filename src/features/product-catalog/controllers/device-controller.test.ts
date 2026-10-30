import { describe, it, expect, beforeEach } from 'vitest'
import { getDevicesController, getDeviceByIdController } from './device-controller'
import { setDeviceRepository } from '@/composition/registry'
import { DeviceRepository } from '../use-cases/device-repository'
import { Device } from '../domain/device'
import { DeviceNotFoundError } from '../use-cases/get-device-by-id'

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

describe('Device Controller', () => {
  const sample: Device[] = [
    { id: '1', name: 'iPhone 16 Pro', brand: 'Apple', type: 'Smartphones', price: 999, color: 'Desert Titanium', tone: 'sand', tag: 'POPULAR', storage: '128 GB', screen: '6.3-inch', chip: 'A18 Pro', camera: '48 MP', battery: 'Up to 27 hours', os: 'iOS 18', stock: 12 },
  ]

  beforeEach(() => {
    setDeviceRepository(new FastMockDeviceRepository(sample))
  })

  it('PC-12: should get devices via controller wiring', async () => {
    const devices = await getDevicesController()
    expect(devices).toHaveLength(1)
    expect(devices[0].name).toBe('iPhone 16 Pro')
  })

  it('PC-13: should get device by id via controller', async () => {
    const device = await getDeviceByIdController('1')
    expect(device.id).toBe('1')
    expect(device.brand).toBe('Apple')
  })

  it('PC-14: should throw DeviceNotFoundError when id not found via controller', async () => {
    await expect(getDeviceByIdController('99')).rejects.toThrowError(DeviceNotFoundError)
  })
})
