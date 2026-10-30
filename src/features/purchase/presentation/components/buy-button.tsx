import { LoaderCircle, ArrowRight } from 'lucide-react'

export type BuyButtonProps = {
  price: number
  busy: boolean
  done: boolean
  onClick: () => void
}

export function BuyButton({ price, busy, done, onClick }: BuyButtonProps) {
  return (
    <button
      className="primary-button buy"
      disabled={busy || done}
      onClick={onClick}
    >
      {busy ? (
        <>
          <LoaderCircle className="spin" size={18} /> Making it yours…
        </>
      ) : (
        <>
          Make it yours{' '}
          <span>
            ${price.toLocaleString('en-US')} <ArrowRight size={18} />
          </span>
        </>
      )}
    </button>
  )
}
