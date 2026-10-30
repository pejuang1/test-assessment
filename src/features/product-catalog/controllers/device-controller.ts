import { Device } from '../domain/device'
import { getDevices } from '../use-cases/get-devices'
import { getDeviceById } from '../use-cases/get-device-by-id'
import { createDeviceRepository } from '@/composition/registry'

export async function getDevicesController(): Promise<Device[]> {
  const repository = createDeviceRepository()
  return getDevices(repository)
}

export async function getDeviceByIdController(id: string): Promise<Device> {
  const repository = createDeviceRepository()
  return getDeviceById(repository, id)
}
