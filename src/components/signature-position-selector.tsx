import { Group, Radio } from '@mantine/core'
import { useState } from 'react'

export const SignaturePositionSelector = ({
  onSelectPosition
}: {
  onSelectPosition: (coords: { x: number; y: number }) => void
}) => {
  const [position, setPosition] = useState({ x: 30, y: 750 })

  const positions = [
    { label: 'Top Left', x: 30, y: 750 },
    { label: 'Top Center', x: 150, y: 750 },
    { label: 'Top Right', x: 350, y: 750 },
    { label: 'Bottom Left', x: 50, y: 100 },
    { label: 'Bottom Center', x: 150, y: 100 },
    { label: 'Bottom Right', x: 350, y: 100 }
  ]

  return (
    <Group gap={5}>
      {positions.map((pos) => (
        <Radio
          size="xs"
          key={pos.label}
          variant="default"
          label={pos.label}
          checked={position.x === pos.x && position.y === pos.y}
          onChange={() => {
            onSelectPosition({ x: pos.x, y: pos.y })
            setPosition({ x: pos.x, y: pos.y })
          }}
        />
      ))}
    </Group>
  )
}
