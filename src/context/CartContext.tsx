'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { getToken } from '@/lib/session'
import { verifyToken } from '@/lib/jwt'

type CartProduct = {
  id: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    img?: string
  }
}

type Cart = {
  id: number
  products: CartProduct[]
}

type CartContextType = {
  cart: Cart | null
  loading: boolean
  fetchCart: () => Promise<void>
  addProduct: (productId: number, quantity?: number) => Promise<void>
  removeProduct: (productId: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    setLoading(true)
    try {
      const cartId = localStorage.getItem('cartId')
      const token = await getToken()
      let userId: number | null = null

      if (token) {
        const payload = verifyToken(token)
        if (payload && payload.id) userId = payload.id
      }

      let cart

      if (cartId) {
        const res = await fetch(`/api/cart?cartId=${cartId}`, {
          credentials: 'include',
        })
        if (res.ok) {
          cart = await res.json()
        }
      }

      if (!cart) {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        })
        if (!res.ok) throw new Error('Failed to create cart')
        cart = await res.json()
      }

      setCart(cart)
      if (cart?.id) localStorage.setItem('cartId', String(cart.id))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productId: number, quantity = 1) => {
    if (!cart) await fetchCart()
    try {
      const cartId = cart?.id || Number(localStorage.getItem('cartId'))
      if (!cartId) return

      const res = await fetch('/api/cart/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cartId, productId, quantity }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add product')

      await fetchCart() // refresca el carrito después de añadir/restar
    } catch (err) {
      console.error(err)
    }
  }

  const removeProduct = async (productId: number) => {
    if (!cart) return
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cartId: cart.id, productId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to remove product')
      await fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  const clearCart = async () => {
    if (!cart) return
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cartId: cart.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to clear cart')
      await fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return (
    <CartContext.Provider
      value={{ cart, loading, fetchCart, addProduct, removeProduct, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
