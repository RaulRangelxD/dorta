'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import LogoutButton from './Logout'
import { useAuth } from '@/context/AuthContext'

const UserDropdown = () => {
  const [userOpen, setUserOpen] = useState(false)
  const { user, loading } = useAuth()

  if (loading) return null

  return (
    <div>
      <motion.div
        onClick={() => setUserOpen(!userOpen)}
        className='flex flex-row items-center ps-0 lg:ps-4 gap-4 border border-slate-800 hover:border-blue-500/50 rounded-full overflow-hidden cursor-pointer select-none'
        whileTap={{ scale: 0.9 }}
      >
        <span className='hidden lg:flex text-slate-200 font-bold text-sm text-end capitalize'>
          {user?.role || 'User'}
        </span>
        <Image
          className='rounded-full border border-gray-500/15 object-cover'
          src='/profile.jpg'
          width={40}
          height={40}
          alt='profile'
        />
      </motion.div>
      {userOpen && (
        <div className='fixed flex flex-col w-[calc(100vw-1rem)] max-w-2xs lg:w-auto lg:max-w-xs lg:min-w-3xs right-2 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all shadow-lg z-50 p-4 gap-1'>
          <span className='text-slate-200 font-bold text-wrap break-all'>
            {user?.name}
          </span>
          <span className='text-slate-400 font-bold text-sm text-wrap break-all'>
            {user?.email}
          </span>
          <span className='text-blue-400 font-bold text-sm capitalize'>
            {user?.role}
          </span>
          <div className='flex'>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDropdown
