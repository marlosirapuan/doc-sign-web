import { type ReactNode, createContext, use, useEffect, useState } from 'react'

interface AuthContextType {
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')

    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem('token', token)

    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('token')

    setToken(null)
  }

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => use(AuthContext)
