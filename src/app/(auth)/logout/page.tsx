'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function LogoutPage() {
  const router = useRouter()
  const t = useTranslations('Logout')

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className='flex flex-col bg-slate-950 items-center justify-center min-h-screen'>
      <Image
        className='rounded-2xl'
        src='/pulgar_arriba.webp'
        alt='Logout'
        width={400}
        height={400}
      />
      <p className='mt-4 text-slate-200 text-lg text-center'>{t('message')}</p>
    </div>
  )
}
