import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const url = new URL(req.url)
  const idParam = url.pathname.split('/').pop()

  const orderId = Number(idParam)
  if (isNaN(orderId)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { cart: true },
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  await prisma.$transaction([
    order.cart
      ? prisma.cart.update({
          where: { id: order.cart.id },
          data: { orderId: null },
        })
      : prisma.cart.updateMany({ where: { id: -1 }, data: {} }),
    prisma.orderItem.deleteMany({ where: { orderId } }),
    prisma.order.delete({ where: { id: orderId } }),
  ])

  return NextResponse.json({ success: true })
}
