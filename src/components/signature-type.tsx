import { SegmentedControl } from '@mantine/core'

type Props = {
  onSelectType: (type: string) => void
}
export const SignatureType = ({ onSelectType }: Props) => {
  return (
    <SegmentedControl
      onChange={(value) => onSelectType(value)}
      data={[
        { label: 'Draw', value: 'draw' },
        { label: 'Upload', value: 'upload' }
      ]}
      fullWidth
    />
  )
}
