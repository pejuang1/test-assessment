import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Device } from '../../domain/device'
import { formatUsdPrice } from '@/shared/lib/formatters'
import { DeviceArt } from './device-art'

export type DeviceCardProps = {
  device: Device
}

export function DeviceCard({ device }: DeviceCardProps) {
  const isTablet = device.type === 'Tablets'
  const formattedPrice = formatUsdPrice(device.price)

  return (
    <Link className="product-card" href={'/product/' + device.id}>
      <DeviceArt
        tone={device.tone}
        brand={device.brand}
        isTablet={isTablet}
        tag={device.tag}
        caption={device.color}
      />
      <div className="product-copy">
        <span className="brand">
          {device.brand} <span> / {isTablet ? 'Tablet' : 'Smartphone'}</span>
        </span>
        <h3>{device.name}</h3>
        <p>{device.storage} <span>·</span> {device.color}</p>
        <div className="product-bottom">
          <strong>{formattedPrice}<small> USD</small></strong>
          <span className="circle-arrow">
            <ArrowUpRight size={19} />
          </span>
        </div>
      </div>
    </Link>
  )
}
