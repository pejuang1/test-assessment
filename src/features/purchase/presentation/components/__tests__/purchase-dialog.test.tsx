import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PurchaseDialog } from '../purchase-dialog'
import { Device } from '@/features/product-catalog/domain/device'

const sampleDevice: Device = {
  id: '1',
  name: 'iPhone 16 Pro',
  brand: 'Apple',
  type: 'Smartphones',
  price: 999,
  color: 'Desert Titanium',
  tone: 'sand',
  tag: 'POPULAR',
  storage: '128 GB',
  screen: '6.3-inch',
  chip: 'A18 Pro',
  camera: '48 MP',
  battery: 'Up to 27 hours',
  os: 'iOS 18',
  stock: 12,
}

describe('PurchaseDialog Component', () => {
  it('PU-07: should render success modal correctly', () => {
    render(
      <PurchaseDialog
        result={{
          status: 'success',
          orderId: 'ORB-12345678',
          deviceId: '1',
          total: 999,
        }}
        device={sampleDevice}
        walletBalance={1050}
      />
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'It’s officially in your orbit.'
    )
    expect(screen.getByText('ORB-12345678')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back to dashboard/ })).toHaveFocus()
  })

  it('PU-08: should render insufficient balance modal with calculated deficit', () => {
    const expensiveDevice: Device = {
      ...sampleDevice,
      id: '2',
      name: 'Galaxy S25 Ultra',
      price: 1299,
    }

    render(
      <PurchaseDialog
        result={{ status: 'insufficient_balance' }}
        device={expensiveDevice}
        walletBalance={1050}
      />
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Insufficient balance'
    )
    expect(
      screen.getByText(/You need \$249 USD more to purchase this Galaxy S25 Ultra/)
    ).toBeInTheDocument()
    expect(screen.getByText('$1,299 USD')).toBeInTheDocument()
  })
})
