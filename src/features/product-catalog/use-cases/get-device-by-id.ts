import { Device } from '../domain/device'
import { DeviceRepository } from './device-repository'

export class DeviceNotFoundError extends Error {
  constructor(id: string) {
    super('We couldn’t find that device.')
    this.name = 'DeviceNotFoundError'
  }
}

export async function getDeviceById(repository: DeviceRepository, id: string): Promise<Device> {
  const device = await repository.getDeviceById(id)
  if (!device) {
    throw new DeviceNotFoundError(id)
  }
  return device
}
