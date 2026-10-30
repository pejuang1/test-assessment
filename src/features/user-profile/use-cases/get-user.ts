import { User } from '../domain/user'
import { UserRepository } from './user-repository'

export async function getUser(repository: UserRepository): Promise<User> {
  return repository.getUser()
}
