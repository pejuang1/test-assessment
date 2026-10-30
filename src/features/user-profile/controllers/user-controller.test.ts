import { describe, it, expect, beforeEach } from 'vitest'
import { getUserController } from './user-controller'
import { setUserRepository } from '@/composition/registry'
import { UserRepository } from '../use-cases/user-repository'
import { User } from '../domain/user'

class FastMockUserRepository implements UserRepository {
  constructor(private user: User) {}
  async getUser(): Promise<User> {
    return this.user
  }
}

describe('User Controller', () => {
  const sampleUser: User = {
    id: 1,
    firstName: 'Dilan',
    lastName: 'Morgan',
    email: 'dilan.1995@email.com',
    membership: 'Orbit Plus',
    walletBalance: 1050,
  }

  beforeEach(() => {
    setUserRepository(new FastMockUserRepository(sampleUser))
  })

  it('UP-04: should return user via controller', async () => {
    const user = await getUserController()
    expect(user).toEqual(sampleUser)
  })
})
