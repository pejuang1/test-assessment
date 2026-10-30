import { describe, it, expect } from 'vitest'
import {
  Device,
  filterByCategory,
  searchDevices,
  sortDevices,
} from './device'

const SAMPLE_DEVICES: Device[] = [
  { id: '1', name: 'iPhone 16 Pro', brand: 'Apple', type: 'Smartphones', price: 999, color: 'Desert Titanium', tone: 'sand', tag: 'POPULAR', storage: '128 GB', screen: '6.3-inch', chip: 'A18 Pro', camera: '48 MP', battery: 'Up to 27 hours', os: 'iOS 18', stock: 12 },
  { id: '2', name: 'Galaxy S25 Ultra', brand: 'Samsung', type: 'Smartphones', price: 1299, color: 'Titanium Gray', tone: 'gray', tag: 'NEW ARRIVAL', storage: '256 GB', screen: '6.9-inch', chip: 'Snapdragon 8 Elite', camera: '200 MP', battery: '5,000 mAh', os: 'Android 15', stock: 12 },
  { id: '3', name: 'iPad Air', brand: 'Apple', type: 'Tablets', price: 599, color: 'Sky Blue', tone: 'blue', tag: '', storage: '128 GB', screen: '11-inch', chip: 'Apple M3', camera: '12 MP', battery: 'Up to 10 hours', os: 'iPadOS 18', stock: 12 },
  { id: '4', name: 'Pixel 9 Pro', brand: 'Google', type: 'Smartphones', price: 999, color: 'Sage', tone: 'sage', tag: '', storage: '128 GB', screen: '6.3-inch', chip: 'Google Tensor G4', camera: '50 MP', battery: '4,700 mAh', os: 'Android 14', stock: 12 },
  { id: '5', name: 'Galaxy Tab S10+', brand: 'Samsung', type: 'Tablets', price: 999, color: 'Moonstone Gray', tone: 'purple', tag: '', storage: '256 GB', screen: '12.4-inch', chip: 'Dimensity 9300+', camera: '13 MP', battery: '10,090 mAh', os: 'Android 14', stock: 12 },
  { id: '6', name: 'iPhone 16', brand: 'Apple', type: 'Smartphones', price: 799, color: 'Ultramarine', tone: 'indigo', tag: 'GREAT VALUE', storage: '128 GB', screen: '6.1-inch', chip: 'A18', camera: '48 MP', battery: 'Up to 22 hours', os: 'iOS 18', stock: 12 },
]

describe('Product Catalog Domain: filter, search, sort', () => {
  it('PC-01: should filter by category "Smartphones"', () => {
    const result = filterByCategory(SAMPLE_DEVICES, 'Smartphones')
    expect(result).toHaveLength(4)
    expect(result.every(d => d.type === 'Smartphones')).toBe(true)
  })

  it('PC-02: should return all devices when category is "All devices"', () => {
    const result = filterByCategory(SAMPLE_DEVICES, 'All devices')
    expect(result).toHaveLength(6)
  })

  it('PC-03: should search case-insensitively across name or brand ("ipHone")', () => {
    const result = searchDevices(SAMPLE_DEVICES, 'ipHone')
    expect(result).toHaveLength(2)
    expect(result.map(d => d.name)).toEqual(['iPhone 16 Pro', 'iPhone 16'])
  })

  it('PC-04: should match brand in search ("sams")', () => {
    const result = searchDevices(SAMPLE_DEVICES, 'sams')
    expect(result).toHaveLength(2)
    expect(result.map(d => d.name)).toEqual(['Galaxy S25 Ultra', 'Galaxy Tab S10+'])
  })

  it('PC-05: should return empty list when no device matches query ("zzz")', () => {
    const result = searchDevices(SAMPLE_DEVICES, 'zzz')
    expect(result).toEqual([])
  })

  it('PC-06: should sort by price low to high', () => {
    const result = sortDevices(SAMPLE_DEVICES, 'low')
    expect(result[0].price).toBe(599)
    expect(result[result.length - 1].price).toBe(1299)
  })

  it('PC-07: should sort by price high to low', () => {
    const result = sortDevices(SAMPLE_DEVICES, 'high')
    expect(result[0].price).toBe(1299)
    expect(result[result.length - 1].price).toBe(599)
  })

  it('PC-08: should keep original order for "featured" without mutating source array', () => {
    const original = [...SAMPLE_DEVICES]
    const result = sortDevices(SAMPLE_DEVICES, 'featured')
    expect(result.map(d => d.id)).toEqual(['1', '2', '3', '4', '5', '6'])
    expect(result).not.toBe(SAMPLE_DEVICES)
    expect(SAMPLE_DEVICES).toEqual(original)
  })
})
