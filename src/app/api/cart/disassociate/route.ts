import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { cartId } = await req.json()

    if (!cartId) {
      return NextResponse.json({ error: 'cartId required' }, { status: 400 })
    }

    const cart = await prisma.cart.update({
      where: { id: cartId },
      data: { userId: null },
      include: { products: true },
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error disassociating cart:', error)
    return NextResponse.json(
      { error: 'Failed to disassociate cart' },
      { status: 500 }
    )
  }
}
