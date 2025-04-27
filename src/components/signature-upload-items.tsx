import { ActionIcon, Badge, Button, Group, Table, Text, Title, Tooltip } from '@mantine/core'

import { IconAlertCircle, IconTrash } from '@tabler/icons-react'

import { fileName, formatDate } from './signature-upload.helpers'

export interface DocumentItem {
  id: number
  file_path: string
  signed: boolean
  created_at: string

  metadata: Partial<{
    ip: string
    geolocation: {
      latitude: number
      longitude: number
    }
  }>
}

type Props = {
  documents: DocumentItem[]
  deletingId: number | null

  onDownload: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
}
export const SignatureUploadItems = ({ documents, deletingId, onDownload, onDelete }: Props) => {
  return (
    <>
      <Title order={3}>Your Documents</Title>

      {documents.length === 0 && (
        <Text c="dimmed" size="sm">
          No documents uploaded yet.
        </Text>
      )}

      <Table.ScrollContainer minWidth={680}>
        <Table highlightOnHover striped withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={110}>Date</Table.Th>
              <Table.Th w={160}>Filename</Table.Th>
              <Table.Th w={100}>Signed</Table.Th>
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
                  <Group gap="xs">
                    <Badge color={doc.signed ? 'green' : 'gray'}>{doc.signed ? 'Signed' : 'Pending'}</Badge>
                    {doc.metadata?.ip && (
                      <Tooltip label={doc.metadata?.ip} withArrow>
                        <IconAlertCircle size={16} />
                      </Tooltip>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td ta="center">
                  <Group gap={5}>
                    <Button variant="outline" onClick={() => onDownload(doc.id)}>
                      Download
                    </Button>
                    <ActionIcon
                      variant="outline"
                      color="red"
                      onClick={() => onDelete(doc.id)}
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
    </>
  )
}
