export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  membership: string
  walletBalance: number
}

export function displayName(user: User): string {
  const parts = [user.firstName, user.lastName].filter(Boolean)
  return parts.join(' ')
}
