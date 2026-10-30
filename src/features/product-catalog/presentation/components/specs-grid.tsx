import { Monitor, Cpu, Camera, Battery, HardDrive, Smartphone } from 'lucide-react'
import { Device } from '../../domain/device'

export type SpecsGridProps = {
  device: Device
}

export function SpecsGrid({ device }: SpecsGridProps) {
  const specs = [
    [Monitor, 'Display', device.screen],
    [Cpu, 'Processor', device.chip],
    [Camera, 'Camera', device.camera],
    [Battery, 'Battery', device.battery],
    [HardDrive, 'Storage', device.storage],
    [Smartphone, 'Operating system', device.os],
  ] as const

  return (
    <div className="specs">
      {specs.map(([Icon, label, value]) => (
        <div key={label}>
          <Icon size={17} />
          <span>
            <small>{label}</small>
            <strong>{value}</strong>
          </span>
        </div>
      ))}
    </div>
  )
}
