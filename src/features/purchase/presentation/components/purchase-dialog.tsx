'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Check, CircleAlert, ArrowRight } from 'lucide-react'
import { PurchaseResult } from '../../domain/purchase'
import { Device } from '@/features/product-catalog/domain/device'

export type PurchaseDialogProps = {
  result: PurchaseResult
  device: Device
  walletBalance: number
}

export function PurchaseDialog({ result, device, walletBalance }: PurchaseDialogProps) {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const link = document.getElementById('success-cta')
    link?.focus()

    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        link?.focus()
      }
    }

    document.addEventListener('keydown', trap)
    return () => {
      document.removeEventListener('keydown', trap)
      previous?.focus()
    }
  }, [])

  const isSuccess = result.status === 'success'
  const deficit = device.price - walletBalance

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
        aria-describedby="success-description"
      >
        <div className="success-icon">
          {isSuccess ? <Check size={32} /> : <CircleAlert size={32} />}
        </div>
        <div className="eyebrow">
          {isSuccess ? 'GOOD THINGS ARE ON THEIR WAY' : 'A LITTLE SHORT THIS TIME'}
        </div>
        <h2 id="success-title">
          {isSuccess ? 'It’s officially in your orbit.' : 'Insufficient balance'}
        </h2>
        <p id="success-description">
          {isSuccess ? (
            <>
              Your {device.name} is one step closer to being your new everyday
              essential.
            </>
          ) : (
            <>
              Your wallet balance is ${walletBalance.toLocaleString('en-US')} USD.
              You need ${deficit.toLocaleString('en-US')} USD more to purchase this{' '}
              {device.name}.
            </>
          )}
        </p>
        <div className="order-info">
          <span>{isSuccess ? 'Order reference' : 'Device price'}</span>
          <strong>
            {isSuccess
              ? result.orderId
              : '$' + device.price.toLocaleString('en-US') + ' USD'}
          </strong>
        </div>
        <Link id="success-cta" className="primary-button" href="/">
          Back to dashboard <ArrowRight size={18} />
        </Link>
        <small>This is a simulated purchase. No charge was made.</small>
      </div>
    </div>
  )
}
