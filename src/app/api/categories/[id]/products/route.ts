import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const categoryId = Number(id)

  if (isNaN(categoryId)) {
    return NextResponse.json(
      { error: 'Invalid category id' },
      { status: 400 }
    )
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: {
        products: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category.products)
  } catch (error) {
    console.error('[CATEGORY_PRODUCTS_GET]', error)
    return NextResponse.json(
      { error: 'Fetch failed' },
      { status: 500 }
    )
  }
}
