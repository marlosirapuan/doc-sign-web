import { useRef } from 'react'

import { Box, Button, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import SignatureCanvas from 'react-signature-canvas'

type Props = {
  onSave: (dataUrl: string) => void
}
export const SignaturePad = ({ onSave }: Props) => {
  //
  // Refs
  //
  const sigCanvas = useRef<SignatureCanvas>(null)

  //
  // Functions
  //
  const handleClear = () => {
    sigCanvas.current?.clear()
  }

  const handleSave = () => {
    if (sigCanvas.current?.isEmpty()) {
      showNotification({
        title: 'Attention',
        message: 'Please draw your signature first!',
        color: 'red'
      })
      return
    }

    const dataUrl = sigCanvas.current?.toDataURL('image/png')

    if (!dataUrl) {
      showNotification({
        title: 'Error',
        message: 'Error saving signature!',
        color: 'red'
      })

      return
    }

    onSave(dataUrl)
  }

  return (
    <Box>
      <SignatureCanvas
        // penColor="black"
        canvasProps={{ width: 600, height: 100 }}
        ref={sigCanvas}
      />
      <Group>
        <Button variant="default" onClick={handleClear}>
          Clear
        </Button>
        <Button onClick={handleSave}>Save Signature</Button>
      </Group>
    </Box>
  )
}
