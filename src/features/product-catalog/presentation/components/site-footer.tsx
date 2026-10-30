import Link from 'next/link'
import { CircleHelp, ArrowRight } from 'lucide-react'

export type SiteFooterProps = {
  variant?: 'dashboard' | 'detail'
}

export function SiteFooter({ variant = 'dashboard' }: SiteFooterProps) {
  return (
    <footer>
      <Link href="/" className="logo">◉ orbit.</Link>
      <span>A better everyday starts here.</span>
      {variant === 'dashboard' ? (
        <span className="footer-end">
          <CircleHelp size={14} /> A demo store, made for learning. <ArrowRight size={14} />
        </span>
      ) : (
        <span className="footer-end">A demo store, made for learning.</span>
      )}
    </footer>
  )
}
