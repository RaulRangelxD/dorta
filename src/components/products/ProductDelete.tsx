'use client'

import Image from 'next/image'
import { useEffect, useState, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

type ProductResponse = {
  id: number
  name: string
  description: string
  price: number
  reference: string
  stock: number
  categoryId: number
  img: string | null
}

export default function ProductDeleteForm() {
  const { id } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products?id=${id}`)
      const data: ProductResponse = await res.json()
      setProduct(data)
    }

    fetchProduct()
  }, [id])

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault()
    if (
      !confirm(
        'Are you sure you want to delete this product? This action cannot be undone.',
      )
    )
      return

    setLoading(true)
    const res = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    })
    setLoading(false)

    if (!res.ok) {
      alert('Error deleting product')
      return
    }

    alert('Product deleted')
    router.push('/admin')
  }

  if (!product) return <p className='text-white'>Loading...</p>

  return (
    <div className='min-h-screen bg-slate-950 text-white flex justify-center px-6 py-12'>
      <div className='w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6'>
        <div className='grid grid-cols-3 justify-between'>
          <motion.button
            onClick={() => router.push('/admin')}
            className='flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors text-sm font-medium'
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={18} /> Back
          </motion.button>
          <h2 className='text-xl font-semibold text-center'>Delete product</h2>
        </div>

        <form
          onSubmit={handleDelete}
          className='w-full max-w-3xl bg-slate-900 rounded-2xl p-6 space-y-6'
        >
          <header>
            <h2 className='text-xl font-semibold text-red-500'>
              Are you sure you want to delete this product?
            </h2>
          </header>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-slate-400'>Name</p>
              <p className='text-white'>{product.name}</p>
            </div>
            <div>
              <p className='text-sm text-slate-400'>Reference</p>
              <p className='text-white'>{product.reference}</p>
            </div>
            <div>
              <p className='text-sm text-slate-400'>Price</p>
              <p className='text-white'>${product.price}</p>
            </div>
            <div>
              <p className='text-sm text-slate-400'>Stock</p>
              <p className='text-white'>{product.stock}</p>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-sm text-slate-400'>Description</p>
            <p className='text-white'>{product.description}</p>
          </div>

          {product.img && (
            <div className='space-y-2'>
              <p className='text-sm text-slate-400'>Current image</p>
              <Image
                src={product.img}
                alt='Product image'
                width={400}
                height={400}
                className='h-48 w-48 rounded-xl object-cover border border-slate-800'
              />
            </div>
          )}

          <footer className='flex justify-between pt-4'>
            <button
              type='button'
              onClick={() => router.back()}
              className='text-slate-400 hover:text-blue-500'
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className='px-6 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition disabled:opacity-50'
            >
              {loading ? 'Deleting...' : 'Delete product'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
