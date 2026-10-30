export function formatUsdPrice(value: number): string {
  return '$' + value.toLocaleString('en-US')
}
