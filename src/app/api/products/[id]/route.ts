import { NextRequest, NextResponse } from 'next/server'
import { MOCK_DEVICES } from '@/features/product-catalog/infrastructure/mock-data'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const device = MOCK_DEVICES.find(d => d.id === id)
  if (!device) {
    return NextResponse.json({ message: 'Device not found' }, { status: 404 })
  }
  return NextResponse.json(device)
}
