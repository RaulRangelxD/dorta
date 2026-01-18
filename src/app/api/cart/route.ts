import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { getToken } from '@/lib/session'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = await getToken()
    let userId: number | null = null
    const cartId = Number(url.searchParams.get('cartId'))

    if (token) {
      const payload = verifyToken(token)
      if (payload && payload.id) userId = payload.id
    }

    let cart
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: { products: { include: { product: true } } },
      })
    } else if (cartId) {
      cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { products: { include: { product: true } } },
      })
    } else {
      return NextResponse.json({ error: 'No user or cartId' }, { status: 400 })
    }

    return NextResponse.json(cart || { products: [] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const token = await getToken()

    let userId: number | null = null

    if (token) {
      const payload = verifyToken(token)
      if (payload && payload.id) {
        userId = payload.id
      }
    }

    let cart
    if (userId) {
      cart = await prisma.cart.upsert({
        where: { userId },
        update: {},
        create: { userId },
        include: { products: true },
      })
    } else {
      cart = await prisma.cart.create({
        data: {},
        include: { products: true },
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { cartId, productId } = await req.json()

    if (!cartId) {
      return NextResponse.json({ error: 'cartId required' }, { status: 400 })
    }

    // Si no hay productId → vaciar carrito
    if (!productId) {
      const deletedMany = await prisma.cartProduct.deleteMany({
        where: { cartId },
      })
      return NextResponse.json({
        message: 'Cart cleared',
        deletedCount: deletedMany.count,
      })
    }

    // Si hay productId → eliminar solo ese producto
    const exists = await prisma.cartProduct.findUnique({
      where: { cartId_productId: { cartId, productId } },
    })

    if (!exists) {
      return NextResponse.json(
        { error: 'Product not found in cart' },
        { status: 404 }
      )
    }

    const deleted = await prisma.cartProduct.delete({
      where: { cartId_productId: { cartId, productId } },
    })
    return NextResponse.json({
      message: 'Product removed',
      deleted,
    })
  } catch (error) {
    console.error('Error deleting cart/product:', error)
    return NextResponse.json(
      { error: 'Failed to delete cart/product' },
      { status: 500 }
    )
  }
}
