'use client'

import React, { ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/utils/types'
import { Edit, ShoppingCart, Trash2 } from 'lucide-react'
import {
  ProductCardContext,
  useProductCardContext,
} from '@/components/cards/ProductCard/ProductCardContext'
import { useCart } from '@/context/CartContext'

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
        } rounded border bg-gray-500/15 border-gray-500/30 shadow-sm overflow-hidden group`}
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

  const imageUrl = product.img?.startsWith('http')
    ? product.img
    : '/placeholder.webp'

  return (
    <div className='relative w-64 h-64 overflow-hidden'>
      <Image
        src={imageUrl}
        alt={product.name}
        fill
        className='object-cover transition-transform duration-300 group-hover:scale-105'
      />
    </div>
  )
}

const ProductName = () => {
  const { product } = useProductCardContext()
  return <h3 className={`text-sm font-medium mb-1 `}>{product.name}</h3>
}

const ProductPrice = () => {
  const { product } = useProductCardContext()
  return <p className={`text-md font-bold mb-3 `}>${product.price}</p>
}

const ProductCategory = () => {
  const { product } = useProductCardContext()
  return <p className={`text-md font-bold mb-3 `}>${product.category.name}</p>
}

const ProductInfo = ({ children }: { children: ReactNode }) => {
  return <div className='flex flex-col space-y-0.5 items-start'>{children}</div>
}

const ProductAction = () => {
  const { product } = useProductCardContext()
  const { addProduct } = useCart()

  const handleAddToCart = async () => {
    try {
      await addProduct(product.id, 1)
      alert(`Producto "${product.name}" añadido al carrito`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('No se pudo añadir el producto al carrito')
    }
  }

  return (
    <div className='w-full flex justify-between items-center mt-2'>
      <p className={`text-md font-bold `}>${product.price}</p>
      <button
        onClick={handleAddToCart}
        className='flex gap-2 px-2 py-1 justify-center items-center bg-blue-700 rounded font-medium hover:bg-blue-800 transition-colors'
      >
        <ShoppingCart className='w-4 h-4' />
      </button>
    </div>
  )
}

const ProductAdminAction = () => {
  const { product } = useProductCardContext()
  const router = useRouter()

  return (
    <div className='flex gap-2 mt-4'>
      <button
        onClick={() => router.push(`/admin/edit/${product.id}`)}
        className='p-2 border rounded hover:bg-gray-100 transition-colors'
      >
        <Edit size={18} />
      </button>
      <button
        onClick={() => {
          if (confirm('¿Eliminar producto?')) {
            router.push(`/admin/delete/${product.id}`)
          }
        }}
        className='p-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors'
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}

ProductCard.Name = ProductName
ProductCard.Price = ProductPrice
ProductCard.Category = ProductCategory
ProductCard.Info = ProductInfo
ProductCard.Image = ProductImage
ProductCard.Action = ProductAction
ProductCard.AdminAction = ProductAdminAction
