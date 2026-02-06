import { cookies } from 'next/headers'
import { verifyToken } from './jwt'

export type AuthUser = {
  id: number
  name?: string
  email: string
  role?: string
}

export async function getUserFromToken(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  return verifyToken(token)
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getUserFromToken()

  if (!user) {
    throw new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    })
  }

  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth()

  if (user.role !== 'admin') {
    throw new Response(JSON.stringify({ message: 'Forbidden' }), {
      status: 403,
    })
  }

  return user
}
