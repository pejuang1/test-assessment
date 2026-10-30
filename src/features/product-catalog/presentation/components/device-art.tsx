export type DeviceArtProps = {
  tone: string
  brand: string
  isTablet?: boolean
  tag?: string
  caption: string
  variant?: 'card' | 'detail'
}

export function DeviceArt({
  tone,
  brand,
  isTablet = false,
  tag,
  caption,
  variant = 'card',
}: DeviceArtProps) {
  const containerClass = variant === 'detail'
    ? 'detail-art product-art ' + tone
    : 'product-art ' + tone

  return (
    <div className={containerClass}>
      {tag ? (
        <span className={'badge ' + (tag === 'NEW ARRIVAL' ? 'green' : '')}>
          {tag}
        </span>
      ) : null}
      <div className={'device ' + (isTablet ? 'tablet' : '')}>
        <div className="device-back">
          <div className={'cameras ' + (brand === 'Google' ? 'pixel' : '')}>
            <i />
            <i />
            <i />
          </div>
          <span className="device-brand">
            {brand === 'Apple' ? '●' : brand === 'Google' ? 'G' : 'SAMSUNG'}
          </span>
        </div>
        <div className="device-front">
          <div className="dynamic-island" />
          <div className="wallpaper" />
        </div>
      </div>
      <span className="art-caption">{caption}</span>
    </div>
  )
}
