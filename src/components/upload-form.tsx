import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Container,
  Divider,
  Fieldset,
  Group,
  Stack,
  Table,
  Text,
  Title
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'

import { IconLogout, IconSend, IconTrash } from '@tabler/icons-react'

import { api } from '../libs/axios'

import { useAuth } from '../contexts/auth-context'

import { SignaturePad } from './signature-pad'
import { SignaturePositionSelector } from './signature-position-selector'
import { SignatureType } from './signature-type'
import { ThemeSwitch } from './theme-switch'

interface DocumentItem {
  id: number
  file_path: string
  signed: boolean
  created_at: string
}

const fileName = (path: string) => {
  const parts = path.split('/')
  return parts[parts.length - 1]
}

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString('en', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [signatureType, setSignatureType] = useState('draw')

  const [signatureCoords, setSignatureCoords] = useState({ x: 50, y: 750 })

  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [documents, setDocuments] = useState<DocumentItem[]>([])

  //
  // Functions
  //
  const fetchDocuments = async () => {
    const response = await api.get<DocumentItem[]>('/documents')

    setDocuments(response.data)
  }

  const handleUpload = async () => {
    if (!pdfFile) {
      showNotification({
        title: 'Attention',
        message: 'Please select a PDF or DOCX file!',
        color: 'red'
      })
      return
    }

    if (signatureType === 'draw' && !signatureDataUrl) {
      showNotification({
        title: 'Attention',
        message: 'Please draw your signature first!',
        color: 'red'
      })
      return
    }

    if (signatureType === 'upload' && !uploadedFile) {
      showNotification({
        title: 'Attention',
        message: 'Please upload your signature first!',
        color: 'red'
      })
      return
    }

    setUploading(true)

    const signatureBlob =
      signatureType === 'draw'
        ? await (await fetch(signatureDataUrl!)).blob()
        : new Blob([uploadedFile as File], { type: uploadedFile?.type })

    const formData = new FormData()
    formData.append('file', pdfFile)
    formData.append('signature', signatureBlob, 'my-signature.png')
    formData.append('signature_x', signatureCoords.x.toString())
    formData.append('signature_y', signatureCoords.y.toString())

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

    setDeletingId(id)

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

    setDeletingId(null)
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      setUploadedFile(event.target.files[0])
    }
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

        <Divider />

        <Fieldset legend="Upload your document (.PDF or .DOCX) and sign it below">
          <input
            type="file"
            accept="application/pdf,application/msword,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="block w-full p-2 border rounded"
          />
        </Fieldset>

        <SignatureType onSelectType={(value) => setSignatureType(value)} />

        {signatureType === 'draw' && (
          <Fieldset legend="Draw your signature">
            <SignaturePad onSave={setSignatureDataUrl} />
          </Fieldset>
        )}

        {signatureType === 'upload' && (
          <Fieldset legend="Upload your signature (PNG)">
            <Stack>
              <input type="file" accept="image/png" onChange={handleFileChange} />
              {uploadedFile && <Text c="dimmed">{uploadedFile.name}</Text>}
            </Stack>
          </Fieldset>
        )}

        <Text c="dimmed" size="sm">
          Select the position of your signature on the document
        </Text>
        <SignaturePositionSelector onSelectPosition={(coords) => setSignatureCoords(coords)} />

        {signatureDataUrl && <Alert color="green">Signature saved! You can now upload the document.</Alert>}
        {!signatureDataUrl && (
          <Alert color="orange">Draw or choose your signature above and click "Save" to upload the document.</Alert>
        )}

        <Button variant="gradient" onClick={handleUpload} loading={uploading} leftSection={<IconSend />}>
          {uploading ? 'Sending...' : 'Send Document'}
        </Button>

        <Title order={3}>Your Documents</Title>

        {documents.length === 0 && (
          <Text c="dimmed" size="sm">
            No documents uploaded yet.
          </Text>
        )}

        <Table.ScrollContainer minWidth={650}>
          <Table highlightOnHover striped withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={110}>Date</Table.Th>
                <Table.Th w={160}>Filename</Table.Th>
                <Table.Th w={80}>Signed</Table.Th>
                <Table.Th ta="center" w={130}>
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {documents.map((doc) => (
                <Table.Tr key={doc.id}>
                  <Table.Td c="dimmed" fz="xs">
                    {formatDate(doc.created_at)}
                  </Table.Td>
                  <Table.Td>
                    <Text w={160} truncate inherit>
                      {fileName(doc.file_path)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={doc.signed ? 'green' : 'gray'}>{doc.signed ? 'Signed' : 'Pending'}</Badge>
                  </Table.Td>
                  <Table.Td ta="center">
                    <Group gap={5}>
                      <Button variant="outline" onClick={() => handleDownload(doc.id)}>
                        Download
                      </Button>
                      <ActionIcon
                        variant="outline"
                        color="red"
                        onClick={() => handleDelete(doc.id)}
                        title="Delete document"
                        size="lg"
                        loading={deletingId === doc.id}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Stack>
    </Container>
  )
}
