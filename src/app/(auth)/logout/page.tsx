'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Image src='/pulgar_arriba.webp' alt='Logout' width={400} height={400} />
      <p className='mt-4 text-gray-700 dark:text-gray-300'>
        You have been logged out. Redirecting...
      </p>
    </div>
  )
}
