import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      products: true,
    },
  })

  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const { name } = await req.json()

  const category = await prisma.category.create({
    data: {
      name,
    },
  })

  return NextResponse.json(category)
}

export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))
  const { name } = await req.json()

  const category = await prisma.category.update({
    where: { id },
    data: { name },
  })

  return NextResponse.json(category)
}

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))

  await prisma.category.delete({
    where: { id },
  })

  return NextResponse.json({ message: 'Category deleted' })
}
