import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { cartId, productId, quantity } = await req.json()

  const cartProduct = await prisma.cartProduct.upsert({
    where: { cartId_productId: { cartId, productId } },
    update: { quantity: { increment: quantity } }, // <- aquí incrementa (positivo o negativo)
    create: { cartId, productId, quantity },
  })

  return NextResponse.json(cartProduct)
}

export async function PUT(req: Request) {
  const { cartId, productId, quantity } = await req.json()

  const cartProduct = await prisma.cartProduct.update({
    where: { cartId_productId: { cartId, productId } },
    data: { quantity },
  })

  return NextResponse.json(cartProduct)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const cartId = Number(url.searchParams.get('cartId'))
  const productId = Number(url.searchParams.get('productId'))

  const deleted = await prisma.cartProduct.delete({
    where: { cartId_productId: { cartId, productId } },
  })

  return NextResponse.json({ message: 'Product removed from cart', deleted })
}
