import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { del, put } from '@vercel/blob'
import { requireAdmin } from '@/lib/auth-role'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { products: true },
      })
      if (!category)
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(category)
    }

    const categories = await prisma.category.findMany({
      include: { products: true },
      orderBy: { name: 'asc' }, // Opcional: para que salgan ordenadas
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  await requireAdmin()
  try {
    const formData = await req.formData()
    const name = formData.get('name') as string
    const department = formData.get('department') as string
    const description = formData.get('description') as string
    const file = formData.get('image') as File

    if (!file || !name || !department)
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 },
      )

    // Subida a Vercel Blob
    const blob = await put(
      `categories/${crypto.randomUUID()}-${file.name}`,
      file,
      { access: 'public' },
    )

    const category = await prisma.category.create({
      data: {
        name,
        department,
        description,
        image: blob.url,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ error: 'Creation failed' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  await requireAdmin()
  try {
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    const category = await prisma.category.findUnique({ where: { id } })

    if (!category)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const formData = await req.formData()
    const name = formData.get('name') as string
    const department = formData.get('department') as string
    const description = formData.get('description') as string
    const file = formData.get('image')

    // Construcción dinámica del objeto de actualización
    const updateData: any = {}
    if (name) updateData.name = name
    if (department) updateData.department = department
    if (description !== null) updateData.description = description

    if (file instanceof File && file.size > 0) {
      const blob = await put(
        `categories/${crypto.randomUUID()}-${file.name}`,
        file,
        { access: 'public' },
      )
      updateData.image = blob.url

      // Borrar imagen anterior si existía para ahorrar espacio
      if (category.image) {
        try {
          await del(category.image)
        } catch (e) {
          console.error('No se pudo borrar la imagen anterior:', e)
        }
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  await requireAdmin()
  try {
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    const category = await prisma.category.findUnique({ where: { id } })

    if (!category)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Borrar imagen de Vercel Blob
    if (category.image) {
      try {
        await del(category.image)
      } catch (e) {
        console.warn('No se pudo borrar el blob:', e)
      }
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
