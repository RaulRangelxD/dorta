// src/app/api/users/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'

// GET /api/users
export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }, // never return password
  })

  return NextResponse.json(users)
}

// POST /api/users
export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 },
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'user',
    },
  })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  })
}

// PUT /api/users?id=<id>
export async function PUT(req: Request) {
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))
  const { name, email, password } = await req.json()

  const data: Prisma.UserUncheckedUpdateInput = {}

  if (name !== undefined) data.name = name
  if (email !== undefined) data.email = email
  if (password) {
    data.password = await bcrypt.hash(password, 10)
  }

  const user = await prisma.user.update({
    where: { id },
    data,
  })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  })
}

// DELETE /api/users?id=<id>
export async function DELETE(req: Request) {
  const url = new URL(req.url)
  const id = Number(url.searchParams.get('id'))

  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ message: 'User deleted' })
}
