import { Device } from '../domain/device'
import { DeviceRepository } from '../use-cases/device-repository'
import { MOCK_DEVICES } from './mock-data'
import { delay } from '@/shared/lib/async'

export class InMemoryDeviceRepository implements DeviceRepository {
  private devices: Device[]

  constructor(initialDevices: Device[] = MOCK_DEVICES) {
    this.devices = [...initialDevices]
  }

  async getDevices(): Promise<Device[]> {
    await delay(750)
    return this.devices.map(d => ({ ...d }))
  }

  async getDeviceById(id: string): Promise<Device | null> {
    await delay(600)
    const found = this.devices.find(d => d.id === id)
    return found ? { ...found } : null
  }
}
