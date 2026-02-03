L'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { motion } from 'framer-motion'
import { UserRoundMinus } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  return (
    <motion.button
      onClick={() => logout(router)}
      className='px-4 py-1 bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded'
      whileTap={{ scale: 0.9 }}
    >
      <UserRoundMinus className='text-red-500' size={18} />
    </motion.button>
  )
}
