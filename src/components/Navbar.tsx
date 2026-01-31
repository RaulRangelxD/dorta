import Link from 'next/link'
import Image from 'next/image'
import { Search, LayoutGrid, Laptop } from 'lucide-react'
import LogoutButton from './logout'
import CartDropdown from './CartDropdown'
import { getToken } from '@/lib/session'

const Navbar = async () => {
  const token = await getToken()

  return (
    <nav className='w-full fixed z-50 flex items-center justify-between px-8 py-4 shadow-sm  bg-slate-900 text-slate-100 font-sans'>
      <div className='flex items-center justify-start gap-6'>
        <Link
          href='/'
          className='text-white hover:text-blue-500 flex items-center gap-0.5 transition-colors'
        >
          <Image
            className='rounded object-cover'
            src='/logo.webp'
            width={140}
            height={70}
            alt='logo'
          />
        </Link>
        <div className='flex items-center gap-6 font-medium text-sm'>
          <Link
            href='/categories'
            className='text-white hover:text-blue-500 flex items-center gap-0.5 transition-colors'
          >
            <LayoutGrid className='inline w-4 h-4 mr-1' />
            Categories
          </Link>
          <Link
            href='/dashboard'
            className='text-white hover:text-blue-500 flex items-center gap-0.5 transition-colors'
          >
            <Laptop className='inline w-4 h-4 mr-1' />
            Dashboard
          </Link>
        </div>
      </div>

      <div className='flex items-center gap-6 font-medium'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4' />
          <input
            type='text'
            placeholder='Search products...'
            className='pl-10 pr-4 py-2 bg-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 transition-all'
          />
        </div>

        {!token ? (
          <div className='flex border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden'>
            <Link
              href='/login'
              className='px-4 py-2 bg-slate-800 text-white hover:bg-blue-500/75'
            >
              Login
            </Link>
            <Link
              href='/register'
              className='px-4 py-2 bg-slate-800 text-white hover:bg-green-500/75'
            >
              Register
            </Link>
          </div>
        ) : (
          <div className='flex items-center gap-4 border border-slate-800 bg-slate-900/50 rounded-2xl ps-4'>
            Admin
            <Image
              className='rounded-full border border-gray-500/15 object-cover'
              src='/profile.jpg'
              width={40}
              height={40}
              alt='profile'
            />
            <LogoutButton />
          </div>
        )}

        <CartDropdown />
      </div>
    </nav>
  )
}

export default Navbar
