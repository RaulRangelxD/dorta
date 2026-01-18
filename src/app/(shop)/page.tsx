'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/cards/ProductCard/ProductCard'
import type { Product } from '@/utils/types'
import Loading from '@/components/Loading'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')

        if (!res.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading size={64} text='Loading products...' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 p-8'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            image={<ProductCard.Image />}
            info={
              <ProductCard.Info>
                <ProductCard.Name />
                <ProductCard.Price />
              </ProductCard.Info>
            }
            action={<ProductCard.Action />}
          />
        ))}
      </div>
    </div>
  )
}
