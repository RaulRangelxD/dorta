'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Banknote, Minus, Package, Plus, ShoppingCart, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const CartDropdown = () => {
  const { cart, addProduct, removeProduct, clearCart, createOrder } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [incId, setIncId] = useState<number | null>(null)
  const [decId, setDecId] = useState<number | null>(null)
  const router = useRouter()
  const t = useTranslations('Cart')

  const totalItems = cart?.products.reduce((acc, p) => acc + p.quantity, 0) || 0

  const totalPrice =
    cart?.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0) ||
    0

  const increaseQuantity = async (productId: number) => {
    await addProduct(productId, 1)
    setIncId(productId)
  }

  const decreaseQuantity = async (productId: number, currentQty: number) => {
    await (currentQty <= 1
      ? removeProduct(productId)
      : addProduct(productId, -1))

    setDecId(productId)
  }

  const deleteProduct = async (productId: number) => {
    await removeProduct(productId)
  }

  return (
    <div>
      <motion.div
        onClick={() => setCartOpen(!cartOpen)}
        className='relative group cursor-pointer'
        whileTap={{ scale: 0.9 }}
      >
        <ShoppingCart
          size={24}
          className='text-white group-hover:scale-105 transition-all'
        />
        <span className='absolute -top-2 -right-2 bg-blue-500 text-white group-hover:scale-110 text-[10px] rounded-full w-4 h-4 flex items-center justify-center transition-all select-none'>
          {totalItems}
        </span>
      </motion.div>

      {cartOpen && (
        <div className='fixed max-h-[80vh] right-2 mt-2 w-[calc(100vw-1rem)] max-w-md lg:w-md bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all shadow-lg z-50 p-4 overflow-y-auto'>
          {cart?.products.length ? (
            <>
              {cart.products.map((item) => (
                <div
                  key={item.product.id}
                  className='group pb-2 border-b border-slate-800 hover:border-blue-500/50 transition-all flex items-center gap-3 mb-3'
                >
                  <div className='relative flex items-center justify-center rounded-2xl overflow-hidden w-32 min-h-32'>
                    {item.product.img?.startsWith('http') ? (
                      <Image
                        src={item.product.img}
                        alt={item.product.name}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform'
                      />
                    ) : (
                      <Package
                        size={32}
                        className='text-slate-700 group-hover:text-blue-500 transition-colors'
                      />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='w-[calc(35vw)] max-w-md xs:w-64 truncate font-medium'>
                      {item.product.name}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <motion.button
                        onClick={() =>
                          decreaseQuantity(item.product.id, item.quantity)
                        }
                        className='group/button relative flex gap-2 px-2 py-1 justify-center items-center bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded transition-colors'
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.span
                          animate={
                            decId === item.product.id
                              ? { scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] }
                              : { scale: 1 }
                          }
                          transition={{ duration: 0.4 }}
                          onAnimationComplete={() => setDecId(null)}
                          className={
                            decId === item.product.id
                              ? 'text-green-400 transition-colors'
                              : 'text-slate-500 group-hover/button:text-blue-500 transition-colors'
                          }
                        >
                          <Minus size={16} />
                        </motion.span>
                      </motion.button>
                      <span className='px-2'>{item.quantity}</span>
                      <motion.button
                        onClick={() => increaseQuantity(item.product.id)}
                        className='group/button relative flex gap-2 px-2 py-1 justify-center items-center bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded transition-colors'
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.span
                          animate={
                            incId === item.product.id
                              ? { scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] }
                              : { scale: 1 }
                          }
                          transition={{ duration: 0.4 }}
                          onAnimationComplete={() => setIncId(null)}
                          className={
                            incId === item.product.id
                              ? 'text-green-400 transition-colors'
                              : 'text-slate-500 group-hover/button:text-blue-500 transition-colors'
                          }
                        >
                          <Plus size={16} />
                        </motion.span>
                      </motion.button>
                    </div>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      ${item.product.price.toFixed(2)} {t('p/u')} ×{' '}
                      {item.quantity} = $
                      {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => deleteProduct(item.product.id)}
                    whileTap={{ scale: 0.9 }}
                    className='group/button relative flex gap-2 px-2 py-1 justify-center items-center bg-slate-800 border border-slate-800 hover:border-red-500/50 rounded transition-colors'
                  >
                    <X
                      className='text-slate-500 group-hover/button:text-red-500 transition-colors'
                      size={16}
                    />
                  </motion.button>
                </div>
              ))}

              <div className='pt-3 mt-2 flex justify-between items-center font-semibold'>
                <span>{t('total')}:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className='flex justify-between mt-3'>
                <motion.button
                  onClick={clearCart}
                  whileTap={{ scale: 0.9 }}
                  className='group/button relative px-3 py-2 justify-center items-center bg-slate-800 border border-slate-800 hover:border-red-500/50 rounded transition-colors'
                >
                  <ShoppingCart
                    className='text-slate-500 group-hover/button:text-red-500 transition-colors'
                    size={16}
                  />
                  <span className='absolute -top-0.5 text-slate-500 group-hover/button:text-red-500 transition-colors text-[10px] rounded-full w-4 h-4 flex items-center justify-center'>
                    x
                  </span>
                </motion.button>
                {cart?.orderId ? (
                  <motion.button
                    onClick={() => {
                      router.push(`/orders/${cart.orderId}`)
                      setCartOpen(!cartOpen)
                    }}
                    whileTap={{ scale: 0.9 }}
                    className='group/button px-3 py-2 justify-center items-center bg-slate-800 border border-slate-800 hover:border-green-500/50 rounded transition-colors'
                  >
                    <Banknote
                      className='text-slate-500 group-hover/button:text-green-500'
                      size={16}
                    />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={async () => {
                      const order = await createOrder()
                      if (order) router.push(`/orders/${order.id}`)
                      setCartOpen(!cartOpen)
                    }}
                    whileTap={{ scale: 0.9 }}
                    className='group/button px-3 py-2 justify-center items-center bg-slate-800 border border-slate-800 hover:border-green-500/50 rounded transition-colors'
                  >
                    <Banknote
                      className='text-slate-500 group-hover/button:text-green-500'
                      size={16}
                    />
                  </motion.button>
                )}
              </div>
            </>
          ) : (
            <p>{t('empty')}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CartDropdown
