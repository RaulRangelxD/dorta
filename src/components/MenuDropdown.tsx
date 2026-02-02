'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Laptop, LayoutGrid, Menu, Search } from 'lucide-react'
import Link from 'next/link'

type MenuProps = {
  admin?: boolean
}

const MenuDropdown = ({ admin = false }: MenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className='relative'>
      <motion.div
        onClick={() => setMenuOpen(!menuOpen)}
        className='flex items-center gap-4 rounded-full overflow-hidden ps-2 cursor-pointer select-none'
        whileTap={{ scale: 0.9 }}
      >
        <Menu size={24} className='text-slate-500 hover:text-blue-500' />
      </motion.div>
      {menuOpen && (
        <div className='absolute flex flex-col gap-3 left-0 mt-2 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all shadow-lg z-50 p-4 overflow-y-auto custom-scroll'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4' />
            <input
              type='text'
              placeholder='Search products...'
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
                Categories
              </Link>
            </>
          ) : (
            <>
              <Link
                href='/categories'
                className='text-white hover:text-blue-500 flex items-center gap-0.5 transition-colors'
              >
                <LayoutGrid className='inline w-4 h-4 mr-1' />
                Categories
              </Link>
              <Link
                href='/admin'
                className='text-white hover:text-blue-500 flex items-center gap-0.5 transition-colors'
              >
                <Laptop className='inline w-4 h-4 mr-1' />
                Dashboard
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MenuDropdown
