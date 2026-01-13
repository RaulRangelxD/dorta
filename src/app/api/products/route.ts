import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const { name, description, price, reference, stock, img, categoryId } =
    await req.json()

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      reference,
      stock,
      img,
      categoryId,
    },
  })

  return NextResponse.json(product)
}

export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))

  const { name, description, price, reference, stock, img, categoryId } =
    await req.json()

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: Number(price),
      reference,
      stock,
      img,
      categoryId,
    },
  })

  return NextResponse.json(product)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))

  await prisma.product.delete({
    where: { id },
  })

  return NextResponse.json({ message: 'Product deleted' })
}
