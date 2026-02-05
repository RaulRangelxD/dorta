'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

type AuthUser = {
  id: number
  name?: string
  email: string
  role: string
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  hasRole: (role: string) => boolean
  isAdmin: boolean
  logout: () => void
  loginUser: () => Promise<void>
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

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) throw new Error('Failed to fetch user')
      const data = await res.json()
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const loginUser = async () => {
    setLoading(true)
    await fetchUser()
  }

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
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
