'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/dont-permissions')
    }
  }, [loading, user, isAdmin, router])

  if (loading) return null
  if (!user || !isAdmin) return null

  return <>{children}</>
}
