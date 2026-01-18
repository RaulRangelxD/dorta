'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'

export default function LogoutButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => logout(router)}
      className='px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600'
    >
      Logout
    </button>
  )
}
