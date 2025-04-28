import { useEffect, useState } from 'react'

import { Alert, Button, Center, Fieldset, Loader } from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { IconCloudUpload } from '@tabler/icons-react'

import { SignaturePad } from './signature-pad'
import { SignaturePositionSelector } from './signature-position-selector'
import { SignatureType } from './signature-type'
import { SignatureUploadItems } from './signature-upload-items'
import { getIPAndLocation } from './signature-upload.helpers'

import { useDocuments } from '../hooks/use-documents'

export const UploadForm = () => {
  //
  // Hooks
  //
  const { query, mutation } = useDocuments({
    enabled: true
  })

  //
  // States
  //
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [signatureType, setSignatureType] = useState('draw')

  const [signatureCoords, setSignatureCoords] = useState({ x: 50, y: 750 })

  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [currentIPGeolocation, setCurrentIPGeolocation] = useState<{
    ip: null
    geolocation: {
      latitude: number
      longitude: number
    } | null
  }>({
    ip: null,
    geolocation: null
  })

  //
  // Functions
  //
  const handleUpload = async () => {
    if (!pdfFile) {
      return showNotification({
        title: 'Attention',
        message: 'Please select a PDF or DOCX file!',
        color: 'red'
      })
    }

    if ((signatureType === 'draw' && !signatureDataUrl) || (signatureType === 'upload' && !uploadedFile)) {
      return showNotification({
        title: 'Attention',
        message: `Please ${signatureType === 'draw' ? 'draw your signature and SAVE SIGNATURE' : 'upload your signature'} first!`,
        color: 'red'
      })
    }

    setUploading(true)

    try {
      const signatureBlob =
        signatureType === 'draw'
          ? await (await fetch(signatureDataUrl!)).blob()
          : new Blob([uploadedFile as File], { type: uploadedFile?.type })

      const formData = new FormData()
      formData.append('file', pdfFile)
      formData.append('signature', signatureBlob, 'my-signature.png')
      formData.append('signature_x', signatureCoords.x.toString())
      formData.append('signature_y', signatureCoords.y.toString())

      if (currentIPGeolocation.ip && currentIPGeolocation.geolocation) {
        formData.append('ip', currentIPGeolocation.ip || '')
        formData.append(
          'geolocation',
          `${String(currentIPGeolocation.geolocation?.latitude || '')},${String(currentIPGeolocation.geolocation?.longitude || '')}`
        )
      }

      await mutation.createDocument.mutateAsync(formData)

      showNotification({
        title: 'Success',
        message: 'Document uploaded successfully!',
        color: 'green'
      })
    } catch (error) {
      console.error(error)

      showNotification({
        title: 'Error',
        message: 'Error uploading document!',
        color: 'red'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    setDeletingId(id)

    const response = await mutation.deleteDocument.mutateAsync(id)

    if (response.status === 200) {
      showNotification({
        title: 'Success',
        message: 'Document deleted successfully!',
        color: 'green'
      })
    } else {
      showNotification({
        title: 'Error',
        message: 'Error deleting document!',
        color: 'red'
      })
    }

    setDeletingId(null)
  }

  const handleDownload = async (id: number) => {
    const response = await mutation.downloadDocument.mutateAsync(id)

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `document-${id}.pdf`)
    document.body.appendChild(link)
    link.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      setUploadedFile(event.target.files[0])
    }
  }

  //
  // Effects
  //
  useEffect(() => {
    const fetchIPGeolocation = async () => {
      const response = await getIPAndLocation()
      const { ip, geolocation } = response
      setCurrentIPGeolocation({ ip, geolocation })
    }

    fetchIPGeolocation()
  }, [])

  const documents = query.data?.data || []

  return (
    <>
      <Fieldset legend="1) Upload your document (.PDF or .DOCX) and sign it below">
        <input
          type="file"
          accept="application/pdf,application/msword,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          className="block w-full p-2 border rounded"
        />
      </Fieldset>

      <Fieldset legend="2) Select your signature type">
        <SignatureType onSelectType={(value) => setSignatureType(value)} />
      </Fieldset>

      {signatureType === 'draw' && (
        <Fieldset legend="3) Draw your signature">
          <SignaturePad onSave={setSignatureDataUrl} />
        </Fieldset>
      )}

      {signatureType === 'upload' && (
        <Fieldset legend="3) Upload your signature (PNG)">
          <input type="file" accept="image/png" onChange={handleFileChange} />
        </Fieldset>
      )}

      {signatureDataUrl && <Alert color="green">Signature saved! You can now upload the document.</Alert>}
      {!signatureDataUrl && (
        <Alert color="orange">Draw or choose your signature above and click "Save" to upload the document.</Alert>
      )}

      <Fieldset legend="4) Select signature position">
        <SignaturePositionSelector onSelectPosition={(coords) => setSignatureCoords(coords)} />
      </Fieldset>

      <Button variant="gradient" onClick={handleUpload} loading={uploading} leftSection={<IconCloudUpload />}>
        {uploading ? 'Sending...' : 'Send Document'}
      </Button>

      {query.isLoading && (
        <Center>
          <Loader size="lg" />
        </Center>
      )}

      {!query.isLoading && (
        <SignatureUploadItems
          documents={documents}
          deletingId={deletingId}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}
