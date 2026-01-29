import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { del, put } from '@vercel/blob';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const category = await prisma.category.findUnique({
        where: { id: Number(id) },
        include: { products: true },
      });
      if (!category)
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(category);
    }

    const categories = await prisma.category.findMany({
      include: { products: true },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const file = formData.get('image') as File;

    if (!file || !name)
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const blob = await put(
      `categories/${crypto.randomUUID()}-${file.name}`,
      file,
      { access: 'public' },
    );

    // Corrección: Eliminado 'description' y usado 'image'
    const category = await prisma.category.create({
      data: { name, image: blob.url },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Creation failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const file = formData.get('image');

    const updateData: { name?: string; image?: string } = {};
    if (name) updateData.name = name;

    if (file instanceof File && file.size > 0) {
      const blob = await put(
        `categories/${crypto.randomUUID()}-${file.name}`,
        file,
        { access: 'public' },
      );
      updateData.image = blob.url;
      if (category.image) await del(category.image);
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (category.image) await del(category.image);

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
