'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Grid2X2, List, Loader2 } from 'lucide-react'
import { ProductCard } from '@/components/cards/ProductCard/ProductCard'
import type { Product } from '@/utils/types'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('productView')
    if (saved === 'grid' || saved === 'list') {
      setViewMode(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('productView', viewMode)
  }, [viewMode])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Error loading products')
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error('Error loading products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className='min-h-full bg-slate-950 text-white'>
      <div className='max-w-7xl mx-auto px-6 pt-10'>
        <div className='flex flex-row flex-nowrap w-full mb-12 justify-end items-center'>
          <div className='relative flex items-center bg-slate-900 rounded-2xl overflow-hidden rounded-s-2xl border border-slate-800 hover:border-blue-500/50'>
            <motion.div
              layout
              layoutId='view-toggle'
              className='absolute top-0 bottom-0 w-[50%] rounded-xl bg-slate-800'
              animate={{
                left: viewMode === 'list' ? 0 : 35,
              }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            />
            <button
              onClick={() => setViewMode('list')}
              className={`z-10 p-2 transition-colors ${
                viewMode === 'list'
                  ? 'text-white hover:text-blue-500'
                  : 'text-slate-400 hover:text-blue-500'
              }`}
              aria-label='List view'
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`z-10 p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'text-white hover:text-blue-500'
                  : 'text-slate-400 hover:text-blue-500'
              }`}
              aria-label='Grid view'
            >
              <Grid2X2 size={18} />
            </button>
          </div>
        </div>
        <div className='flex-1'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <Loader2 className='w-10 h-10 text-blue-600 animate-spin mb-4' />
              <p className='text-slate-500 text-sm'>Syncing products...</p>
            </div>
          ) : (
            <motion.div
              initial='hidden'
              animate='visible'
              className={
                viewMode === 'grid'
                  ? 'flex flex-row flex-wrap justify-center gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout={viewMode}
                  size={viewMode === 'list' ? 'w-full' : undefined}
                  image={<ProductCard.Image />}
                  info={
                    viewMode === 'list' ? (
                      <ProductCard.Info>
                        <ProductCard.InfoList>
                          <ProductCard.Name />
                          <ProductCard.Price />
                        </ProductCard.InfoList>
                        <ProductCard.Action />
                      </ProductCard.Info>
                    ) : (
                      <ProductCard.Info>
                        <ProductCard.Name />
                        <ProductCard.InfoList>
                          <ProductCard.Price />
                          <ProductCard.Action />
                        </ProductCard.InfoList>
                      </ProductCard.Info>
                    )
                  }
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
