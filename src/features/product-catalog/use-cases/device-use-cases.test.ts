import { describe, it, expect } from 'vitest'
import { DeviceRepository } from './device-repository'
import { getDevices } from './get-devices'
import { getDeviceById, DeviceNotFoundError } from './get-device-by-id'
import { Device } from '../domain/device'

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

const SAMPLE_DEVICES: Device[] = [
  { id: '1', name: 'iPhone 16 Pro', brand: 'Apple', type: 'Smartphones', price: 999, color: 'Desert Titanium', tone: 'sand', tag: 'POPULAR', storage: '128 GB', screen: '6.3-inch', chip: 'A18 Pro', camera: '48 MP', battery: 'Up to 27 hours', os: 'iOS 18', stock: 12 },
  { id: '3', name: 'iPad Air', brand: 'Apple', type: 'Tablets', price: 599, color: 'Sky Blue', tone: 'blue', tag: '', storage: '128 GB', screen: '11-inch', chip: 'Apple M3', camera: '12 MP', battery: 'Up to 10 hours', os: 'iPadOS 18', stock: 12 }
]

describe('Product Catalog Use Cases', () => {
  it('PC-09: should return list of devices from repository', async () => {
    const repo = new MockDeviceRepository(SAMPLE_DEVICES)
    const devices = await getDevices(repo)
    expect(devices).toHaveLength(2)
    expect(devices[0].name).toBe('iPhone 16 Pro')
  })

  it('PC-10: should return device by id with stock: 12', async () => {
    const repo = new MockDeviceRepository(SAMPLE_DEVICES)
    const device = await getDeviceById(repo, '3')
    expect(device.id).toBe('3')
    expect(device.name).toBe('iPad Air')
    expect(device.stock).toBe(12)
  })

  it('PC-11: should throw DeviceNotFoundError when id is not found', async () => {
    const repo = new MockDeviceRepository(SAMPLE_DEVICES)
    await expect(getDeviceById(repo, '99')).rejects.toThrowError(DeviceNotFoundError)
    await expect(getDeviceById(repo, '99')).rejects.toThrow('We couldn’t find that device.')
  })
})
