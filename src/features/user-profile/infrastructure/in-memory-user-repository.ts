import { User } from '../domain/user'
import { UserRepository } from '../use-cases/user-repository'
import { MOCK_RAW_USER } from './mock-user'
import { delay } from '@/shared/lib/async'

export class InMemoryUserRepository implements UserRepository {
  async getUser(): Promise<User> {
    await delay(450)
    return {
      id: MOCK_RAW_USER.id,
      firstName: MOCK_RAW_USER.first_name,
      lastName: MOCK_RAW_USER.last_name,
      email: MOCK_RAW_USER.email,
      membership: MOCK_RAW_USER.membership,
      walletBalance: MOCK_RAW_USER.wallet_balance,
    }
  }
}
