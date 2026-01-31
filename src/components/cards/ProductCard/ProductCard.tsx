'use client'

import React, { ReactNode, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/utils/types'
import { Edit, Package, ShoppingCart, Trash2 } from 'lucide-react'
import {
  ProductCardContext,
  useProductCardContext,
} from '@/components/cards/ProductCard/ProductCardContext'
import { useCart } from '@/context/CartContext'
import { motion } from 'framer-motion'

type ProductCardProps = {
  product: Product
  image?: ReactNode
  info?: ReactNode
  action?: ReactNode
  size?: string
  layout?: 'grid' | 'list'
}

const itemVars = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export const ProductCard = ({
  product,
  image,
  info,
  action,
  layout = 'grid',
}: ProductCardProps) => {
  const isList = layout === 'list'

  return (
    <ProductCardContext.Provider value={{ product, layout }}>
      <motion.div
        variants={itemVars}
        className={`group bg-slate-900 border border-slate-800 rounded-2xl
          hover:border-blue-500/50 transition-all overflow-hidden
          ${isList ? 'flex flex-row items-stretch w-full' : 'flex flex-col w-48'}
        `}
      >
        {image}
        <div className={`p-4 ${isList ? 'flex-1 flex items-center' : ''}`}>
          <div className='w-full'>
            {info}
            {action}
          </div>
        </div>
      </motion.div>
    </ProductCardContext.Provider>
  )
}

const ProductImage = () => {
  const { product, layout } = useProductCardContext()
  const isList = layout === 'list'

  return (
    <div
      className={`
        relative flex items-center justify-center overflow-hidden
        ${
          isList
            ? 'w-32 min-h-32 border-r border-slate-800 group-hover:border-blue-500/50'
            : 'w-full h-48 border-b border-slate-800 group-hover:border-blue-500/50'
        }
      `}
    >
      {product.img?.startsWith('http') ? (
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes={isList ? '128px' : '(min-width: 768px) 25vw, 100vw'}
          className='object-cover group-hover:scale-105 transition-transform'
        />
      ) : (
        <Package
          size={isList ? 32 : 48}
          className='text-slate-700 group-hover:text-blue-500 transition-colors'
        />
      )}
    </div>
  )
}

const ProductName = () => {
  const { product } = useProductCardContext()
  return <h3 className={`text-sm font-medium`}>{product.name}</h3>
}

const ProductPrice = () => {
  const { product } = useProductCardContext()
  return <p className={`text-md font-bold`}>${product.price}</p>
}

const ProductCategory = () => {
  const { product } = useProductCardContext()
  return <p className={`text-md font-bold`}>${product.category.name}</p>
}

const ProductInfo = ({ children }: { children: ReactNode }) => {
  const { layout } = useProductCardContext()

  return (
    <div
      className={`flex gap-2 ${
        layout === 'list'
          ? 'flex-row justify-between items-center'
          : 'flex-col items-start'
      }`}
    >
      {children}
    </div>
  )
}

const ProductInfoList = ({ children }: { children: ReactNode }) => {
  const { layout } = useProductCardContext()

  return (
    <div
      className={`w-full flex gap-2 ${
        layout === 'list'
          ? 'flex-col items-start justify-center'
          : 'flex-row justify-between items-center'
      }`}
    >
      {children}
    </div>
  )
}

const ProductAction = () => {
  const { product } = useProductCardContext()
  const { addProduct } = useCart()

  const [added, setAdded] = useState(false)

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
    <div className='flex justify-between items-center'>
      <motion.button
        onClick={handleAddToCart}
        className='relative flex gap-2 px-3 py-2 justify-center items-center bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded transition-colors'
        whileTap={{ scale: 0.9 }}
      >
        <motion.span
          animate={
            added
              ? { scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] }
              : { scale: 1 }
          }
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={added ? 'text-green-400' : 'text-blue-500'}
        >
          <ShoppingCart className='w-4 h-4' />
        </motion.span>
      </motion.button>
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
ProductCard.InfoList = ProductInfoList
ProductCard.Image = ProductImage
ProductCard.Action = ProductAction
ProductCard.AdminAction = ProductAdminAction
