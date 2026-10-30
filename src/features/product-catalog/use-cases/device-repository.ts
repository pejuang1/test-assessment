import { Device } from '../domain/device'

export interface DeviceRepository {
  getDevices(): Promise<Device[]>
  getDeviceById(id: string): Promise<Device | null>
}
