'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function HeroCarousel() {
  const [index, setIndex] = useState(0)

  const t = useTranslations('Hero')

  const slides = [
    {
      title: t('slide1Title'),
      subtitle: t('slide1Subtitle'),
      video: '/videos/hero-dorta.mp4',
    },
    {
      title: t('slide2Title'),
      subtitle: t('slide2Subtitle'),
      video: '/videos/hero-dorta2.mp4',
    },
    {
      title: t('slide3Title'),
      subtitle: t('slide3Subtitle'),
      video: '/videos/hero-dorta3.mp4',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className='relative h-150 w-full overflow-hidden rounded-3xl bg-slate-950 mb-12 shadow-2xl border border-white/5'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={slides[index].title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className='absolute inset-0 z-0'
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className='h-full w-full object-cover'
            style={{ filter: 'brightness(0.4) contrast(1.1)' }}
          >
            <source src={slides[index].video} type='video/mp4' />
          </video>
        </motion.div>
      </AnimatePresence>

      <div className='absolute inset-0 z-1 bg-linear-to-r from-slate-950 via-slate-950/40 to-transparent' />

      <div className='relative z-10 flex h-full flex-col justify-center px-8 lg:px-20 max-w-4xl'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='flex items-center gap-2 mb-6'
        ></motion.div>

        <AnimatePresence mode='wait'>
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-white'
          >
            {slides[index].title} <br />
            <span className='text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400'>
              {slides[index].subtitle}
            </span>
          </motion.h1>
        </AnimatePresence>

        <motion.p className='text-slate-300 text-lg lg:text-xl mb-10 max-w-xl leading-relaxed'>
          At Ferroelectrics Dorta, you can rest easy: everything your home needs
          is found right here.
        </motion.p>

        <Link href='/categories'>
          <button className='group bg-blue-600 hover:bg-blue-500 transition-all duration-300 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-blue-900/40'>
            Explore Categories
            <ArrowRight
              className='group-hover:translate-x-1 transition-transform'
              size={20}
            />
          </button>
        </Link>
      </div>

      <div className='absolute bottom-8 right-12 z-20 flex gap-3'>
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  )
}
