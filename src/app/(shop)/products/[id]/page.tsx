'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Loader2, Package, ShoppingCart } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import type { Product } from '@/utils/types'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

export default function ProductViewPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addProduct } = useCart()
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?id=${id}`)
        if (!res.ok) throw new Error('Error loading product')
        setProduct(await res.json())
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className='flex justify-center py-32'>
        <Loader2 className='w-10 h-10 animate-spin text-blue-500' />
      </div>
    )
  }

  if (!product) return null

  const handleAddToCart = async () => {
    try {
      await addProduct(product.id, 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 500)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-4 pt-10'>
      <motion.button
        onClick={() => router.back()}
        className='flex items-center gap-2 text-slate-500 hover:text-blue-500'
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft size={18} /> Back
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden mt-4'
      >
        <div className='grid md:grid-cols-2 gap-8 p-6'>
          <div className='relative w-full aspect-square rounded-xl overflow-hidden bg-slate-800'>
            {product.img?.startsWith('http') ? (
              <Image
                src={product.img}
                alt={product.name}
                fill
                sizes={'(min-width: 480px) 25vw, 100vw'}
                className='object-cover group-hover:scale-105 transition-transform'
              />
            ) : (
              <Package
                size={48}
                className='text-slate-700 group-hover:text-blue-500 transition-colors'
              />
            )}
          </div>

          <div className='flex flex-col items-start gap-4'>
            <span className='text-xs font-bold cursor-pointer rounded-lg py-0.5 px-1 border border-slate-500 hover:border-blue-500 text-slate-500 hover:text-blue-500 bg-blue-500/10 transition-colors select-none'>
              {product.category.department}
            </span>

            <h1 className='text-3xl font-semibold text-white'>
              {product.name}
            </h1>

            <span className='text-sm font-bold cursor-pointer text-slate-500 hover:text-blue-500 transition-colors select-none'>
              {product.category.name}
            </span>

            <p className='text-slate-400 leading-relaxed'>
              {product.description}
            </p>

            <div className='flex items-center justify-between'>
              <span className='text-2xl font-bold text-white'>
                ${product.price}
              </span>
            </div>
            <motion.button
              onClick={handleAddToCart}
              className='group/button relative flex gap-2 px-3 py-2 justify-center items-center bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded transition-colors'
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                animate={
                  added
                    ? { scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={
                  added
                    ? 'text-green-500 transition-colors flex flex-row items-center gap-1'
                    : 'text-slate-500 group-hover/button:text-blue-500 transition-colors flex flex-row items-center gap-1'
                }
              >
                Buy Now
                <ShoppingCart className='w-4 h-4' />
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
