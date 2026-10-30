import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DeviceCard } from '../device-card'
import { Device } from '../../../domain/device'

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

describe('DeviceCard Component', () => {
  it('PC-15: should render device info, formatted price, and tag badge', () => {
    render(<DeviceCard device={sampleDevice} />)

    expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument()
    expect(screen.getByText(/Apple/)).toBeInTheDocument()
    expect(screen.getByText('$999')).toBeInTheDocument()
    expect(screen.getByText('POPULAR')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/product/1')
  })
})
