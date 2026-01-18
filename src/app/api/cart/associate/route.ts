import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { cartId, userId } = await req.json()

    if (!cartId || !userId) {
      return NextResponse.json(
        { error: 'cartId and userId required' },
        { status: 400 }
      )
    }

    const cart = await prisma.cart.update({
      where: { id: cartId },
      data: { userId },
      include: { products: true },
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error associating cart:', error)
    return NextResponse.json(
      { error: 'Failed to associate cart' },
      { status: 500 }
    )
  }
}
