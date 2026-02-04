'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { getToken } from '@/lib/session'
import { verifyToken } from '@/lib/jwt'

type AuthUser = {
  id: number
  email: string
  role: string
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  hasRole: (role: string) => boolean
  isAdmin: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken()
        if (!token) {
          setUser(null)
          return
        }

        const payload = verifyToken(token)
        if (!payload || !payload.role) {
          // Si no hay payload o role, no se autentica
          setUser(null)
          return
        }

        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role, // Ahora TypeScript sabe que role es string
        })
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const logout = () => {
    document.cookie = 'token=; path=/; max-age=0'
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasRole: (role: string) => (user ? user.role === role : false),
        isAdmin: user ? user.role === 'ADMIN' : false,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
