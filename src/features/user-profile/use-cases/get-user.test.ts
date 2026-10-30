import { describe, it, expect } from 'vitest'
import { UserRepository } from './user-repository'
import { getUser } from './get-user'
import { User } from '../domain/user'

class MockUserRepository implements UserRepository {
  constructor(private user: User) {}
  async getUser(): Promise<User> {
    return this.user
  }
}

describe('User Profile Use Case: getUser', () => {
  it('UP-03: should return user from repository', async () => {
    const mockUser: User = {
      id: 1,
      firstName: 'Dilan',
      lastName: 'Morgan',
      email: 'dilan.1995@email.com',
      membership: 'Orbit Plus',
      walletBalance: 1050,
    }
    const repo = new MockUserRepository(mockUser)
    const result = await getUser(repo)
    expect(result).toEqual(mockUser)
  })
})
