import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { cartId, userId } = await req.json()

    if (!cartId) {
      return NextResponse.json({ error: 'Cart ID required' }, { status: 400 })
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart || cart.products.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const total = cart.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    )

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: userId || null,
          total,
        },
      })

      for (const item of cart.products) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        })
      }

      await tx.cart.update({
        where: { id: cartId },
        data: {
          orderId: newOrder.id,
        },
      })

      return newOrder
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    )
  }
}
