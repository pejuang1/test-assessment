import { Device } from '../domain/device'
import { DeviceRepository } from '../use-cases/device-repository'

export class ApiDeviceRepository implements DeviceRepository {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  async getDevices(): Promise<Device[]> {
    const res = await fetch(`${this.baseUrl}/api/products`)
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`)
    }
    return res.json()
  }

  async getDeviceById(id: string): Promise<Device | null> {
    const res = await fetch(`${this.baseUrl}/api/products/${id}`)
    if (res.status === 404) {
      return null
    }
    if (!res.ok) {
      throw new Error(`Failed to fetch product ${id}: ${res.statusText}`)
    }
    return res.json()
  }
}
