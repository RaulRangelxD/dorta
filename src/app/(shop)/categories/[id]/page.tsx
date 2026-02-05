'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, PackageSearch } from 'lucide-react'
import { ProductList } from '@/components/products/ProductsList'
import { useEffect, useState } from 'react'

interface Category {
  id: number
  name: string
}

export default function CategoryDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch('/api/categories')
        const categories: Category[] = await res.json()
        const selected = categories.find(c => c.id === Number(id))
        setCategory(selected || null)
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [id])

  if (loading) {
    return null
  }

  if (!category) {
    return (
      <div className='min-h-screen bg-[#020817] text-white flex flex-col items-center justify-center gap-4'>
        <PackageSearch size={64} className='text-slate-700' />
        <p className='text-slate-400'>Category not found</p>
        <button
          onClick={() => router.push('/categories')}
          className='text-blue-500 hover:underline'
        >
          Back to catalog
        </button>
      </div>
    )
  }

  return (
    <main className='max-w-6xl mx-auto px-6 mt-12'>
      {/* BACK */}
      <button
        onClick={() => router.back()}
        className='flex items-center gap-2 text-slate-500 hover:text-white mb-8'
      >
        <ArrowLeft size={18} />
        <span className='text-sm font-medium'>Back to Categories</span>
      </button>

      {/* HEADER */}
      <header className='mb-12'>
        <h1 className='text-4xl font-bold text-white mb-2'>
          {category.name}
        </h1>
      </header>

      {/* PRODUCT LIST */}
      <ProductList
        endpoint={`/api/categories/${id}/products`}
        mode='shop'
      />
    </main>
  )
}
