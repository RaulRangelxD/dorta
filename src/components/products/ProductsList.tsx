'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Grid2X2, List, Loader2, Plus } from 'lucide-react'
import { ProductCard } from '@/components/cards/ProductCard/ProductCard'
import type { Product } from '@/utils/types'
import { useRouter } from 'next/navigation'

type Props = {
  endpoint: string
  mode?: 'shop' | 'admin'
}

export function ProductList({ endpoint, mode = 'shop' }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('productView')
    if (saved === 'grid' || saved === 'list') setViewMode(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('productView', viewMode)
  }, [viewMode])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error('Error loading products')
        setProducts(await res.json())
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [endpoint])

  return (
    <>
      <div className='flex flex-row-reverse justify-between mb-12'>
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
                : 'text-slate-500 hover:text-blue-500'
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
                : 'text-slate-500 hover:text-blue-500'
            }`}
            aria-label='Grid view'
          >
            <Grid2X2 size={18} />
          </button>
        </div>
        {mode === 'admin' && (
          <>
            <motion.button
              onClick={() => {
                router.push(`/admin/products/new`)
              }}
              className='group/button flex gap-2 px-3 py-2 justify-center items-center bg-slate-900 border border-slate-800 hover:border-green-500/50 rounded transition-colors'
              whileTap={{ scale: 0.9 }}
            >
              <Plus
                className='text-slate-500 group-hover/button:text-green-500'
                size={18}
              />
            </motion.button>
            <motion.button
              onClick={() => router.back()}
              className='flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors text-sm font-medium'
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={18} /> Back
            </motion.button>
          </>
        )}
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center py-20'>
          <Loader2 className='w-10 h-10 animate-spin text-blue-500' />
        </div>
      ) : (
        <motion.div
          className={
            viewMode === 'grid'
              ? 'flex flex-wrap gap-6 justify-center'
              : 'flex flex-col gap-4'
          }
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              layout={viewMode}
              image={<ProductCard.Image />}
              info={
                viewMode === 'list' ? (
                  <ProductCard.Info>
                    <ProductCard.InfoList>
                      <ProductCard.Deparment />
                      <ProductCard.Name />
                      <ProductCard.Category />
                      <ProductCard.Price />
                    </ProductCard.InfoList>
                    {mode === 'admin' ? (
                      <ProductCard.AdminAction />
                    ) : (
                      <ProductCard.Action />
                    )}
                  </ProductCard.Info>
                ) : (
                  <ProductCard.Info>
                    <ProductCard.Deparment />
                    <ProductCard.Name />
                    <ProductCard.Category />
                    <ProductCard.InfoList>
                      <ProductCard.Price />
                      {mode === 'admin' ? (
                        <ProductCard.AdminAction />
                      ) : (
                        <ProductCard.Action />
                      )}
                    </ProductCard.InfoList>
                  </ProductCard.Info>
                )
              }
            />
          ))}
        </motion.div>
      )}
    </>
  )
}
