'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import LogoutButton from './Logout'

const UserDropdown = () => {
  const [userOpen, setUserOpen] = useState(false)

  return (
    <div className='relative'>
      <motion.div
        onClick={() => setUserOpen(!userOpen)}
        className='flex items-center gap-4 border border-slate-800 hover:border-blue-500/50 rounded-full overflow-hidden ps-2 cursor-pointer select-none'
        whileTap={{ scale: 0.9 }}
      >
        Admin
        <Image
          className='rounded-full border border-gray-500/15 object-cover'
          src='/profile.jpg'
          width={40}
          height={40}
          alt='profile'
        />
      </motion.div>
      {userOpen && (
        <div className='absolute right-0 mt-2 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all shadow-lg z-50 p-4 overflow-y-auto custom-scroll'>
          <LogoutButton />
        </div>
      )}
    </div>
  )
}

export default UserDropdown
