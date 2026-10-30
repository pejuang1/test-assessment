import { DeviceRepository } from '@/features/product-catalog/use-cases/device-repository'
import { InMemoryDeviceRepository } from '@/features/product-catalog/infrastructure/in-memory-device-repository'
import { UserRepository } from '@/features/user-profile/use-cases/user-repository'
import { InMemoryUserRepository } from '@/features/user-profile/infrastructure/in-memory-user-repository'

let deviceRepositoryInstance: DeviceRepository | null = null
let userRepositoryInstance: UserRepository | null = null

export function createDeviceRepository(): DeviceRepository {
  if (!deviceRepositoryInstance) {
    deviceRepositoryInstance = new InMemoryDeviceRepository()
  }
  return deviceRepositoryInstance
}

export function setDeviceRepository(repo: DeviceRepository | null) {
  deviceRepositoryInstance = repo
}

export function createUserRepository(): UserRepository {
  if (!userRepositoryInstance) {
    userRepositoryInstance = new InMemoryUserRepository()
  }
  return userRepositoryInstance
}

export function setUserRepository(repo: UserRepository | null) {
  userRepositoryInstance = repo
}
