import Link from 'next/link'

export function SiteHeader() {
  return (
    <header>
      <Link href="/" className="logo">
        <span className="orbit-mark">◉</span> orbit<span className="logo-dot">.</span>
      </Link>
      <nav>
        <Link href="/" className="nav-active">Discover</Link>
      </nav>
      <div className="header-right">
        <span className="header-note">A little upgrade. A lot of possibility.</span>
        <div className="avatar small">AM</div>
      </div>
    </header>
  )
}
