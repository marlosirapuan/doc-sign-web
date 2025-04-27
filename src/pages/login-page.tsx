import { useState } from 'react'

import { Box, Button, Center, Container, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useNavigate } from 'react-router'

import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'

import { api } from '../libs/axios'

import { ThemeSwitch } from '../components/theme-switch'

import { useAuth } from '../contexts/auth-context'

export const LoginPage = () => {
  //
  // Context
  //
  const auth = useAuth()

  //
  // Hooks
  //
  const navigate = useNavigate()

  //
  // State
  //
  const [isProcessing, setIsProcessing] = useState(false)

  //
  // Forms
  //
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
    }
  })

  //
  // Functions
  //
  const handleSubmit = async (values: typeof form.values) => {
    setIsProcessing(true)

    try {
      const res = await api.post('http://localhost:3000/login', {
        email: values.email,
        password: values.password
      })

      const token = res.data.token

      auth?.login(token)

      navigate('/')
    } catch (error) {
      console.error(error)

      showNotification({
        title: 'Error',
        message: 'Invalid email or password',
        color: 'red'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Title ta="center">eSignature</Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Small web app for signing documents
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Stack>
            <TextInput label="Email" placeholder="user1@example.com" required {...form.getInputProps('email')} />
            <PasswordInput label="Password" placeholder="password123" required {...form.getInputProps('password')} />
          </Stack>

          <Button fullWidth mt="xl" type="submit" loading={isProcessing}>
            Sign in
          </Button>
        </Paper>

        <Center mt="xs">
          <ThemeSwitch />
        </Center>
      </Box>
    </Container>
  )
}
