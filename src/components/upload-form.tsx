import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { ActionIcon, Badge, Button, Container, Divider, Fieldset, Group, Stack, Text, Title } from '@mantine/core'

import { IconLogout, IconPdf, IconSend, IconTrash } from '@tabler/icons-react'

import { api } from '../libs/axios'

import { useAuth } from '../contexts/auth-context'

import { showNotification } from '@mantine/notifications'
import { SignaturePad } from './signature-pad'
import { ThemeSwitch } from './theme-switch'

interface DocumentItem {
  id: number
  file_path: string
  signed: boolean
  created_at: string
}

export const UploadForm = () => {
  //
  // Context
  //
  const auth = useAuth()

  //
  // Hooks
  //
  const navigate = useNavigate()

  //
  // States
  //
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState<DocumentItem[]>([])

  //
  // Functions
  //
  const fetchDocuments = async () => {
    const response = await api.get<DocumentItem[]>('/documents')

    setDocuments(response.data)
  }

  const handleUpload = async () => {
    if (!pdfFile || !signatureDataUrl) {
      showNotification({
        title: 'Attention',
        message: 'Please select the PDF and draw the signature!',
        color: 'red'
      })
      return
    }

    setUploading(true)

    const signatureBlob = await (await fetch(signatureDataUrl)).blob()

    const formData = new FormData()
    formData.append('file', pdfFile)
    formData.append('signature', signatureBlob, 'my-signature.png')
    formData.append('signature_x', '100')
    formData.append('signature_y', '100')

    try {
      await api.post('documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      showNotification({
        title: 'Success',
        message: 'Document uploaded successfully!',
        color: 'green'
      })

      fetchDocuments()
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

    const response = await api.delete(`/documents/${id}`)

    if (response.status === 200) {
      showNotification({
        title: 'Success',
        message: 'Document deleted successfully!',
        color: 'green'
      })

      fetchDocuments()
    } else {
      showNotification({
        title: 'Error',
        message: 'Error deleting document!',
        color: 'red'
      })
    }
  }

  const handleSignout = async () => {
    auth?.logout()

    navigate('/login', { replace: true })
  }

  const handleDownload = async (id: number) => {
    const token = localStorage.getItem('token')

    const res = await api.get(`/documents/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `document-${id}.pdf`)
    document.body.appendChild(link)
    link.click()
  }

  //
  // Effects
  //
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchDocuments()
  }, [])

  return (
    <Container size={700} py="xl">
      <Stack>
        <Title>Document Upload and Signature</Title>

        <Divider />

        <Group justify="flex-end">
          <ThemeSwitch />
          <Divider orientation="vertical" />
          <Text>Logged</Text>
          <Button variant="default" leftSection={<IconLogout />} onClick={handleSignout}>
            Sign Out
          </Button>
        </Group>

        <Text>Upload your document (.PDF or .DOCX) and sign it below.</Text>
        <input
          type="file"
          accept="application/pdf,application/msword,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          className="block w-full p-2 border rounded"
        />

        <Fieldset legend="Sign">
          <SignaturePad onSave={setSignatureDataUrl} />
        </Fieldset>

        <Button onClick={handleUpload} disabled={uploading} leftSection={<IconSend />}>
          {uploading ? 'Sending...' : 'Send Document'}
        </Button>

        <Title order={3}>Your Documents</Title>

        {documents.length === 0 && (
          <Text c="dimmed" size="sm">
            No documents uploaded yet.
          </Text>
        )}

        {documents.map((doc) => (
          <Group key={doc.id} justify="space-between">
            <Group>
              <Text c="dimmed" size="xs">
                {new Date(doc.created_at).toLocaleString('en', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text>Document #{doc.id}</Text>
              <Badge color={doc.signed ? 'green' : 'gray'}>{doc.signed ? 'Signed' : 'Pending'}</Badge>
            </Group>

            <Group>
              <Button variant="outline" onClick={() => handleDownload(doc.id)} leftSection={<IconPdf />}>
                Download
              </Button>
              <ActionIcon
                variant="outline"
                color="red"
                onClick={() => handleDelete(doc.id)}
                title="Delete document"
                size="lg"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>
        ))}
      </Stack>
    </Container>
  )
}
