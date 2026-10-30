import { NextResponse } from 'next/server'
import { MOCK_DEVICES } from '@/features/product-catalog/infrastructure/mock-data'

export async function GET() {
  return NextResponse.json(MOCK_DEVICES)
}
