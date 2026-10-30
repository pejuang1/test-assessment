'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Truck, ShieldCheck } from 'lucide-react'
import { Device } from '@/features/product-catalog/domain/device'
import { getDeviceByIdController } from '@/features/product-catalog/controllers/device-controller'
import { purchaseDeviceController } from '@/features/purchase/controllers/purchase-controller'
import { PurchaseResult } from '@/features/purchase/domain/purchase'
import { useAppDispatch, useAppSelector } from '@/composition/store/hooks'
import { selectWalletBalance } from '@/composition/store/slices/user-slice'
import { addOrder } from '@/composition/store/slices/orders-slice'

import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'
import { DeviceArt } from '../components/device-art'
import { BuyButton } from '@/features/purchase/presentation/components/buy-button'
import { SpecsGrid } from '../components/specs-grid'
import { PurchaseDialog } from '@/features/purchase/presentation/components/purchase-dialog'

export type ProductDetailPageProps = {
  id: string
}

export function ProductDetailPage({ id }: ProductDetailPageProps) {
  const dispatch = useAppDispatch()
  const balance = useAppSelector(selectWalletBalance)

  const [device, setDevice] = useState<Device | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<PurchaseResult | null>(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    async function loadDevice() {
      try {
        const data = await getDeviceByIdController(id)
        if (mounted) {
          setDevice(data)
        }
      } catch (e: unknown) {
        if (mounted) {
          setErr(e instanceof Error ? e.message : 'We couldn’t find that device.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadDevice()

    return () => {
      mounted = false
    }
  }, [id])

  async function buy() {
    if (busy || done || !device) return
    setBusy(true)
    setErr('')

    try {
      const result = await purchaseDeviceController({
        deviceId: device.id,
        balance,
      })
      if (result.status === 'success') {
        dispatch(addOrder(result))
      }
      setDone(result)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Purchase failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="detail-main">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Back to discover
        </Link>

        {loading ? (
          <div className="loading">A closer look is on its way…</div>
        ) : !device ? (
          <div className="empty">
            <h1>Device not found.</h1>
            <p role="alert">{err}</p>
            <Link className="primary-button" href="/">
              Back to dashboard <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="detail-grid">
            <div>
              <DeviceArt
                variant="detail"
                tone={device.tone}
                brand={device.brand}
                isTablet={device.type === 'Tablets'}
                tag="THE EVERYDAY, REIMAGINED"
                caption="Designed for your everyday."
              />
              <p className="illustration-note">
                Illustrative device preview. Specifications are demo data.
              </p>
            </div>

            <div className="detail-copy">
              <div className="eyebrow">
                {device.brand} / {device.type}
              </div>
              <h1>{device.name}</h1>
              <p className="description">
                A little more possibility in your hands. Beautifully designed,
                effortlessly powerful, and ready for whatever your day brings.
              </p>
              <div className="detail-price">
                ${device.price.toLocaleString('en-US')}{' '}
                <span>USD · One-time payment</span>
              </div>
              <div className="divider" />
              <div className="option-label">
                COLOR <strong>{device.color}</strong>
              </div>
              <div className={'color-swatch ' + device.tone}>
                <Check size={16} />
              </div>
              <div className="option-label">STORAGE</div>
              <div className="storage-option">
                {device.storage}
                <Check size={15} />
              </div>

              <h2 className="spec-heading">Small details. Big difference.</h2>
              <SpecsGrid device={device} />

              <div className="in-stock">
                <span /> In stock. Ready for your next chapter.
              </div>

              {err && (
                <p role="alert" className="error">
                  {err}
                </p>
              )}

              <BuyButton
                price={device.price}
                busy={busy}
                done={!!done}
                onClick={buy}
              />

              <p className="purchase-note">
                Demo purchase · No payment or personal details needed
              </p>

              <div className="detail-perks">
                <span>
                  <Truck size={16} /> Free shipping
                </span>
                <span>
                  <ShieldCheck size={16} /> 1-year warranty
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter variant="detail" />

      {done && device && (
        <PurchaseDialog
          result={done}
          device={device}
          walletBalance={balance}
        />
      )}
    </>
  )
}
