import { describe, it, expect } from 'vitest'
import { User, displayName } from './user'

describe('User Profile Domain', () => {
  it('UP-01: should return full name from user', () => {
    const user: User = {
      id: 1,
      firstName: 'Dilan',
      lastName: 'Morgan',
      email: 'dilan.1995@email.com',
      membership: 'Orbit Plus',
      walletBalance: 1050,
    }
    expect(displayName(user)).toBe('Dilan Morgan')
  })

  it('UP-02: should handle single name correctly', () => {
    const user: User = {
      id: 2,
      firstName: 'Alex',
      lastName: '',
      email: 'alex@email.com',
      membership: 'Orbit Plus',
      walletBalance: 1050,
    }
    expect(displayName(user)).toBe('Alex')
  })
})
