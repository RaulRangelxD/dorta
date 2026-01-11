// src/app/api/users/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/users
export async function GET() {
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}

// POST /api/users
export async function POST(req: Request) {
  const { name, email } = await req.json()
  const user = await prisma.user.create({
    data: { name, email },
  })
  return NextResponse.json(user)
}

// PUT /api/users?id=<id>
export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))
  const { name, email } = await req.json()

  const user = await prisma.user.update({
    where: { id },
    data: { name, email },
  })
  return NextResponse.json(user)
}

// DELETE /api/users?id=<id>
export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ message: 'User deleted' })
}
