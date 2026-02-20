import Image from 'next/image'
import { LanguageSwitcher } from './LanguageSwitcher'

export default function Footer() {
  const currentYear = 2026

  return (
    <footer className='w-full bg-slate-950 border-t border-white/5 py-12'>
      <div className='max-w-375 mx-auto px-4 lg:px-10'>
        <div
          className='flex flex-col md:flex-row items-center justify-between gap-8
                        animate-fade-in-up'
        >
          {/* Logo (Left) */}
          <div className='flex items-center justify-start w-full md:w-auto'>
            <Image
              src='/logo.webp' // or '/logo.png'
              alt='Dorta Appliance Parts'
              width={140}
              height={40}
              className='object-contain transition-transform duration-300 hover:scale-105'
            />
          </div>

          {/* Development Credits (Center) */}
          <div className='text-center'>
            <p className='text-slate-300 text-sm font-medium'>
              Created and developed by{' '}
              <span className='text-white font-semibold'>
                Raul Rangel & Alejandra Chacon
              </span>{' '}
              from{' '}
              <a
                href='https://cunaguaros.dev'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 font-semibold hover:text-blue-400 transition-colors'
              >
                CunaguarosDev
              </a>
            </p>
            <p className='text-slate-500 text-xs mt-1'>
              © {currentYear} All rights reserved
            </p>
          </div>

          {/* Legal Links (Right) */}
          <div className='flex gap-6 text-slate-500 text-xs'>
            <a href='#' className='hover:text-white transition-colors'>
              Privacy Policy
            </a>
            <a href='#' className='hover:text-white transition-colors'>
              Terms of Service
            </a>
            <a href='#' className='hover:text-white transition-colors'>
              Support
            </a>
          </div>
          <LanguageSwitcher className='hidden lg:flex' />
        </div>
      </div>
    </footer>
  )
}
