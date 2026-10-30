import { describe, it, expect } from 'vitest'
import { formatUsdPrice } from './formatters'

describe('Domain/Shared Lib: formatUsdPrice', () => {
  it('TC-01: should format 999 as $999', () => {
    expect(formatUsdPrice(999)).toBe('$999')
  })

  it('TC-02: should format 1050 with comma as $1,050', () => {
    expect(formatUsdPrice(1050)).toBe('$1,050')
  })

  it('TC-03: should format 1299 with comma as $1,299', () => {
    expect(formatUsdPrice(1299)).toBe('$1,299')
  })
})
