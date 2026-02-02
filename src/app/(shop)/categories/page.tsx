'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  Package,
  ArrowRight,
  Refrigerator,
  Wrench,
  Wind,
  Cpu,
  Sparkles,
  LucideIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  [key: string]: unknown
}

interface Category {
  id: number
  name: string
  department: string
  description: string | null
  image: string | null
  products: Product[]
}

interface Department {
  name: string
  icon: LucideIcon
}

const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVars = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeDept, setActiveDept] = useState<string>('Major Appliances')
  const router = useRouter()

  const departments: Department[] = [
    { name: 'Major Appliances', icon: Refrigerator },
    { name: 'Tools & Repair', icon: Wrench },
    { name: 'Climate Control', icon: Wind },
    { name: 'Electronics', icon: Cpu },
    { name: 'Care & Cleaning', icon: Sparkles },
  ]

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch('/api/categories')
        const data: Category[] = await res.json()
        setCategories(data)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setTimeout(() => setIsLoading(false), 800)
      }
    }
    fetchCats()
  }, [])

  const renderSkeletons = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='bg-[#0b1120] border border-slate-800 rounded-2xl overflow-hidden animate-pulse'
        >
          <div className='h-48 bg-slate-800/50' />
          <div className='p-6 space-y-4'>
            <div className='h-6 bg-slate-800 rounded-md w-3/4' />
            <div className='h-10 bg-slate-800/80 rounded-xl w-full' />
          </div>
        </div>
      ))}
    </div>
  )

  const filteredCategories = categories.filter(
    (cat) => (cat.department || 'Major Appliances') === activeDept,
  )

  return (
    <div className='min-h-screen bg-[#020817] text-white'>
      <main className='max-w-7xl mx-auto p-6 py-10'>
        <div className='mb-12'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors text-sm font-medium'
          >
            <ChevronLeft size={18} /> Back
          </button>
        </div>

        <header className='mb-12'>
          <h1 className='text-4xl font-bold tracking-tight text-white mb-3'>
            {activeDept}
          </h1>
          <p className='text-slate-400 text-lg'>
            Find the exact part for your equipment.
          </p>
        </header>

        <div className='flex flex-col lg:flex-row gap-8'>
          <aside className='w-full lg:w-64 shrink-0'>
            <div className='bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sticky top-10'>
              <h3 className='text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6'>
                Departments
              </h3>
              <nav className='space-y-2'>
                {departments.map((dept) => {
                  const Icon = dept.icon
                  const isActive = activeDept === dept.name
                  return (
                    <button
                      key={dept.name}
                      onClick={() => setActiveDept(dept.name)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-500 font-bold'
                          : 'text-slate-400 hover:bg-slate-800/50 font-medium'
                      }`}
                    >
                      <Icon size={18} /> {dept.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          <div className='flex-1'>
            {isLoading ? (
              renderSkeletons()
            ) : filteredCategories.length > 0 ? (
              <motion.div
                key={activeDept}
                variants={containerVars}
                initial='hidden'
                animate='visible'
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              >
                {filteredCategories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    variants={itemVars}
                    className='group bg-[#0b1120] border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_30px_-5px_rgba(37,106,244,0.3)] transition-all duration-300'
                  >
                    <div className='h-48 bg-[#020817] relative flex items-center justify-center border-b border-slate-800/50'>
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className='object-cover group-hover:scale-105 transition-transform duration-500'
                        />
                      ) : (
                        <Package size={48} className='text-slate-800' />
                      )}
                    </div>
                    <div className='p-6'>
                      <h3 className='text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors'>
                        {cat.name}
                      </h3>
                      <p className='text-slate-500 text-sm mb-6'>
                        {cat.products?.length || 0} items listed.
                      </p>
                      <Link
                        href={`/categories/${cat.id}`}
                        className='flex items-center justify-between w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20'
                      >
                        View Parts <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className='text-center py-20 bg-[#0b1120]/50 rounded-3xl border border-dashed border-slate-800'>
                <p className='text-slate-500'>
                  No categories in this department yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
