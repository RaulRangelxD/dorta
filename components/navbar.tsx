import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Search } from 'lucide-react' // Importamos Search

const Navbar = () => {
  return (
    <nav className='flex items-center justify-between px-8 py-4 shadow-sm'>
      <div className='flex items-center justify-start gap-6'>
        <Image 
          className='rounded object-cover' 
          src="/logo.jpg" 
          width={160} 
          height={80} 
          alt='profile' 
        />
        <div className='flex items-center gap-6 font-medium text-sm'>
          <Link href='/products' className='hover:text-blue-600 transition-colors'>
            Products
          </Link>
          <Link href='/categories' className='hover:text-blue-600 transition-colors'>
            Categories
          </Link>
          <Link href='/dashboard' className='hover:text-blue-600 transition-colors'>
            Dashboard
          </Link>
        </div>
      </div>

      <div className='flex items-center gap-6 font-medium'>
        {/* Input de Búsqueda */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4' />
          <input
            type='text'
            placeholder='Search products...'
            className='pl-10 pr-4 py-2 bg-gray-500/15 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64 transition-all'
          />
        </div>

        <Link href='/login' className='hover:text-blue-600 text-sm'>
          Login
        </Link>
        <Link
          href='/register'
          className='bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm'
        >
          Register
        </Link>

        <div className='relative cursor-pointer'>
          <ShoppingCart className='w-6 h-6' />
          <span className='absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center'>
            0
          </span>
        </div>

        <Image 
          className='rounded-full border border-gray-500/15 object-cover' 
          src="/profile.jpg" 
          width={40} 
          height={40} 
          alt='profile' 
        />
      </div>
    </nav>
  )
}

export default Navbar