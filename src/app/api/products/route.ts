import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { del, put } from '@vercel/blob'
import { requireAdmin } from '@/lib/auth-role'

type ProductUpdateData = {
  name?: string
  description?: string
  price?: number
  reference?: string
  stock?: number
  categoryId?: number
  img?: string
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (id) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  }

  const products = await prisma.product.findMany({
    include: { category: true },
  })

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  await requireAdmin()
  const formData = await req.formData()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = Number(formData.get('price'))
  const reference = formData.get('reference') as string
  const stock = Number(formData.get('stock'))
  const categoryId = Number(formData.get('categoryId'))
  const image = formData.get('image') as File

  if (!image) {
    return NextResponse.json({ error: 'Image is required' }, { status: 400 })
  }

  const blob = await put(
    `products/${crypto.randomUUID()}-${image.name}`,
    image,
    { access: 'public' },
  )

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      reference,
      stock,
      img: blob.url,
      categoryId,
    },
  })

  return NextResponse.json(product)
}

export async function PUT(req: Request) {
  await requireAdmin()
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))

  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const formData = await req.formData()
  const data: ProductUpdateData = {}

  const name = formData.get('name')
  if (typeof name === 'string') data.name = name

  const description = formData.get('description')
  if (typeof description === 'string') data.description = description

  const reference = formData.get('reference')
  if (typeof reference === 'string') data.reference = reference

  const price = formData.get('price')
  if (typeof price === 'string') data.price = Number(price)

  const stock = formData.get('stock')
  if (typeof stock === 'string') data.stock = Number(stock)

  const categoryId = formData.get('categoryId')
  if (typeof categoryId === 'string') data.categoryId = Number(categoryId)

  const image = formData.get('image')
  if (image instanceof File) {
    const blob = await put(
      `products/${crypto.randomUUID()}-${image.name}`,
      image,
      { access: 'public' },
    )

    data.img = blob.url

    if (product.img) {
      try {
        await del(product.img)
      } catch (error) {
        console.error('Error deleting old image:', error)
      }
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data,
  })

  return NextResponse.json(updatedProduct)
}

export async function DELETE(req: Request) {
  await requireAdmin()
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))

  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  if (product.img) {
    try {
      await del(product.img)
    } catch (error) {
      console.error('Error deleting blob:', error)
    }
  }

  await prisma.product.delete({
    where: { id },
  })

  return NextResponse.json({ message: 'Product deleted' })
}
