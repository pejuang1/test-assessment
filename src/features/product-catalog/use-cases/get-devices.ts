import { Device } from '../domain/device'
import { DeviceRepository } from './device-repository'

export async function getDevices(repository: DeviceRepository): Promise<Device[]> {
  return repository.getDevices()
}
