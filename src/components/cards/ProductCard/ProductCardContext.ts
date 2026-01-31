import { Product } from '@/utils/types'
import { createContext, useContext } from 'react'

export const ProductCardContext = createContext<{
  product: Product
  layout?: 'grid' | 'list'
} | null>(null)

export const useProductCardContext = () => {
  const context = useContext(ProductCardContext)
  if (!context) {
    throw new Error('product card component error')
  }
  return context
}
