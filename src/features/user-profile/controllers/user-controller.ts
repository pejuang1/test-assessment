import { User } from '../domain/user'
import { getUser } from '../use-cases/get-user'
import { createUserRepository } from '@/composition/registry'

export async function getUserController(): Promise<User> {
  const repository = createUserRepository()
  return getUser(repository)
}
