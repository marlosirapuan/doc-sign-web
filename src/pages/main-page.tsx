import { useNavigate } from 'react-router'

import { Button, Container, Divider, Group, LoadingOverlay, Stack, Text, Title } from '@mantine/core'

import { IconLogout } from '@tabler/icons-react'

import { useAuth } from '../contexts/auth-context'

import { Suspense } from 'react'
import { ThemeSwitch } from '../components/theme-switch'
import { UploadForm } from '../components/upload-form'

export const MainPage = () => {
  //
  // Context
  //
  const auth = useAuth()

  //
  // Hooks
  //
  const navigate = useNavigate()

  //
  // Functions
  //
  const handleSignout = async () => {
    auth?.logout()

    navigate('/login', { replace: true })
  }

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

        <Suspense fallback={<LoadingOverlay visible />}>
          <UploadForm />
        </Suspense>
      </Stack>
    </Container>
  )
}
