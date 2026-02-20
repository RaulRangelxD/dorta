'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Laptop, LayoutGrid, Menu, Search } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type MenuProps = {
  admin?: boolean
  token?: string | null
}

const MenuDropdown = ({ admin = false, token = null }: MenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const t = useTranslations('Navbar')

  return (
    <div>
      <motion.div
        onClick={() => setMenuOpen(!menuOpen)}
        className='flex items-center gap-4 rounded-full overflow-hidden ps-2 cursor-pointer select-none'
        whileTap={{ scale: 0.9 }}
      >
        <Menu size={24} className='text-slate-500 hover:text-blue-500' />
      </motion.div>
      {menuOpen && (
        <div className='fixed flex flex-col w-[calc(100vw-1rem)] xxs:w-3xs gap-3 left-2 mt-2 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all shadow-lg z-50 p-4 overflow-y-auto custom-scroll'>
          {!token && (
            <div className='grid grid-cols-2 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden'>
              <Link
                href='/login'
                className='px-4 py-2 bg-slate-800 text-white hover:bg-blue-500/75'
              >
                {t('login')}
              </Link>
              <Link
                href='/register'
                className='px-4 py-2 bg-slate-800 text-white hover:bg-green-500/75'
              >
                {t('register')}
              </Link>
            </div>
          )}
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4' />
            <input
              type='text'
              placeholder={t('search')}
              className='pl-10 pr-4 py-2 bg-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 transition-all'
            />
          </div>
          {admin ? (
            <>
              <Link
                href='/admin/categories'
                className='text-white hover:text-blue-500 flex items-center gap-0.5 transition-colors'
              >
                <LayoutGrid className='inline w-4 h-4 mr-1' />
                {t('categories')}
              </Link>
            </>
          ) : (
            <>
              <Link
                href='/categories'
                className='text-white hover:text-blue-500 flex items-center gap-0.5 transition-colors'
              >
                <LayoutGrid className='inline w-4 h-4 mr-1' />
                {t('categories')}
              </Link>
              <Link
                href='/admin'
                className='text-white hover:text-blue-500 flex items-center gap-0.5 transition-colors'
              >
                <Laptop className='inline w-4 h-4 mr-1' />
                {t('dashboard')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MenuDropdown
