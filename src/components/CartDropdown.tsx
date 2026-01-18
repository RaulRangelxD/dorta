'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import Loading from './Loading'

const CartDropdown = () => {
  const { cart, loading, addProduct, removeProduct, clearCart } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  const totalItems = cart?.products.reduce((acc, p) => acc + p.quantity, 0) || 0

  const totalPrice =
    cart?.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0) ||
    0

  const decreaseQuantity = async (productId: number, currentQty: number) => {
    if (currentQty <= 1) {
      await removeProduct(productId)
    } else {
      await addProduct(productId, -1)
    }
  }

  const increaseQuantity = async (productId: number) => {
    await addProduct(productId, 1)
  }

  return (
    <div className='relative'>
      <div
        className='relative cursor-pointer'
        onClick={() => setCartOpen(!cartOpen)}
      >
        <ShoppingCart className='w-6 h-6' />
        <span className='absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center'>
          {totalItems}
        </span>
      </div>

      {cartOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded shadow-lg z-50 p-4'>
          {loading ? (
            <Loading />
          ) : cart?.products.length ? (
            <>
              {cart.products.map((item, index) => (
                <div
                  key={item.product.id}
                  className={`${index != cart.products.length - 1 && 'pb-2 border-b border-gray-200 dark:border-gray-800'} flex items-center gap-3 mb-3`}
                >
                  <Image
                    src={item.product.img || '/placeholder.webp'}
                    alt={item.product.name}
                    width={50}
                    height={50}
                    className='object-cover rounded'
                  />
                  <div className='flex-1'>
                    <p className='font-medium'>{item.product.name}</p>
                    <div className='flex items-center gap-2 mt-1'>
                      <button
                        onClick={() =>
                          decreaseQuantity(item.product.id, item.quantity)
                        }
                        className='px-1 py-1 bg-gray-300 dark:bg-gray-700 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-600'
                      >
                        <Minus size={16} />
                      </button>
                      <span className='px-2'>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.product.id)}
                        className='px-1 py-1 bg-gray-300 dark:bg-gray-700 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-600'
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      ${item.product.price.toFixed(2)} p/u × {item.quantity} = $
                      {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeProduct(item.product.id)}
                    className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm'
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <div className='border-t border-gray-300 dark:border-gray-700 pt-3 mt-2 flex justify-between items-center font-semibold text-gray-700 dark:text-gray-200'>
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className='flex justify-end mt-3'>
                <button
                  onClick={clearCart}
                  className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm'
                >
                  Vaciar
                </button>
              </div>
            </>
          ) : (
            <p>Tu carrito está vacío</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CartDropdown
