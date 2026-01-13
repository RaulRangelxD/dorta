'use client'

import React, { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product } from '@/utils/types'
import { Edit, ShoppingCart, Trash2 } from 'lucide-react'
import { postCart } from '@/api/cart'
import {
  ProductCardContext,
  useProductCardContext,
} from '@/components/cards/ProductCard/ProductCardContext'

type ProductCardProps = {
  product: Product
  image?: ReactNode
  info?: ReactNode
  action?: ReactNode
  size?: string
}

export const ProductCard = ({
  product,
  image,
  info,
  action,
  size,
}: ProductCardProps) => {
  return (
    <ProductCardContext.Provider value={{ product }}>
      <div
        className={`${
          size ? size : 'w-full'
        } max-w-xs rounded-xl border bg-gray-500/15 border-gray-500/30 shadow-sm overflow-hidden group`}
      >
        {image}
        <div className='p-4'>
          {info}
          {action}
        </div>
      </div>
    </ProductCardContext.Provider>
  )
}

const ProductImage = () => {
  const { product } = useProductCardContext()
  const imageUrl = product.img
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.img}`
    : '/fallback-image.png'

  return (
    <div className='relative w-full h-64 overflow-hidden'>
      <Image
        src={imageUrl}
        alt={product.name}
        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
      />
    </div>
  )
}

const ProductName = () => {
  const { product } = useProductCardContext()
  return <h3 className={`text-lg font-medium mb-1 `}>{product.name}</h3>
}

const ProductPrice = () => {
  const { product } = useProductCardContext()
  return <p className={`text-xl font-bold mb-3 `}>${product.price}</p>
}

const ProductInfo = ({ children }: { children: ReactNode }) => {
  return <div className='flex flex-col space-y-1 items-center'>{children}</div>
}

const ProductAction = () => {
  const { product } = useProductCardContext()

  const addToCart = async () => {
    try {
      const userToken = localStorage.getItem('user_token') || null
      const existingCartToken = localStorage.getItem('cart') || undefined

      const response = await postCart()

      if (!userToken) {
        localStorage.setItem('cart', response)
      }
      alert(`Producto añadido al carrito`)
    } catch (error) {
      console.error('Error adding to cart', error)
    }
  }

  return (
    <button
      onClick={addToCart}
      className='flex gap-2 w-full justify-center items-center bg-blue-700 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors'
    >
      <ShoppingCart className='w-6 h-6' />
      <span>Add to cart</span>
    </button>
  )
}

const ProductAdminAction = () => {
  const { product } = useProductCardContext()
  const router = useRouter()

  return (
    <div className='flex gap-2 mt-4'>
      <button
        onClick={() => router.push(`/admin/edit/${product.id}`)}
        className='p-2 border rounded-md hover:bg-gray-100 transition-colors'
      >
        <Edit size={18} />
      </button>
      <button
        onClick={() => {
          if (confirm('¿Eliminar producto?')) {
            router.push(`/admin/delete/${product.id}`)
          }
        }}
        className='p-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors'
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}

ProductCard.Name = ProductName
ProductCard.Price = ProductPrice
ProductCard.Info = ProductInfo
ProductCard.Image = ProductImage
ProductCard.Action = ProductAction
ProductCard.AdminAction = ProductAdminAction
