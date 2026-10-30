import { Sparkles } from 'lucide-react'
import { User } from '../../domain/user'

export type WelcomePanelProps = {
  user: User | null
  walletBalance: number
}

export function WelcomePanel({ user, walletBalance }: WelcomePanelProps) {
  const firstName = user?.firstName || 'Alex'
  const email = user?.email || 'Getting your profile ready…'
  const membership = user?.membership || 'Orbit Plus'

  return (
    <section className="welcome" aria-label="User information">
      <div className="welcome-user">
        <div className="avatar">AM</div>
        <div>
          <div className="welcome-label">YOUR PERSONAL SPACE</div>
          <h2>
            Welcome back, {firstName} <span className="wave">✳</span>
          </h2>
          <p>{email}</p>
        </div>
      </div>
      <div className="member">
        <span className="plus">
          <Sparkles size={13} /> {membership}
        </span>
        <p>A little extra, just for you.</p>
      </div>
      <div className="points">
        <span>YOUR WALLET BALANCE</span>
        <strong>
          ${walletBalance.toLocaleString('en-US')} <small>USD</small>
        </strong>
        <p>Ready for your next upgrade.</p>
      </div>
    </section>
  )
}
