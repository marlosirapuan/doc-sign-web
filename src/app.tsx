import { type ReactNode, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { Center, Loader } from '@mantine/core'

import { useAuth } from './contexts/auth-context'

import { UploadForm } from './components/upload-form'

import { LoginPage } from './pages/login-page'

const AuthenticatedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth()

  return auth?.token ? <>{children}</> : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth()

  return auth?.token ? <Navigate to="/" replace /> : <>{children}</>
}

export const App = () => {
  const renderRoute = (path: string, element: ReactNode, isPublic: boolean) => {
    const Wrapper = isPublic ? PublicRoute : AuthenticatedRoute
    return <Route path={path} element={<Wrapper>{element}</Wrapper>} />
  }

  return (
    <Suspense
      fallback={
        <Center>
          <Loader size={150} />
        </Center>
      }
    >
      <BrowserRouter>
        <Routes>
          {renderRoute('/login', <LoginPage />, true)}
          {renderRoute('/', <UploadForm />, false)}
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}
