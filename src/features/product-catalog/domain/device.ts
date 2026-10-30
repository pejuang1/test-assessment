export const DEVICE_TYPES = ['Smartphones', 'Tablets'] as const
export const CATEGORY_FILTERS = ['All devices', ...DEVICE_TYPES] as const

export type DeviceType = (typeof DEVICE_TYPES)[number]
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number]
export type SortOption = 'featured' | 'low' | 'high'

export type Device = {
  id: string
  name: string
  brand: string
  type: DeviceType
  price: number
  color: string
  tone: string
  tag: string
  storage: string
  screen: string
  chip: string
  camera: string
  battery: string
  os: string
  stock: number
}

export function filterByCategory(devices: Device[], category: CategoryFilter): Device[] {
  if (category === 'All devices') return devices
  return devices.filter(d => d.type === category)
}

export function searchDevices(devices: Device[], query: string): Device[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return devices
  return devices.filter(d => (d.name + d.brand).toLowerCase().includes(trimmed))
}

export function sortDevices(devices: Device[], sortBy: SortOption): Device[] {
  if (sortBy === 'low') {
    return [...devices].sort((a, b) => a.price - b.price)
  }
  if (sortBy === 'high') {
    return [...devices].sort((a, b) => b.price - a.price)
  }
  return [...devices]
}
