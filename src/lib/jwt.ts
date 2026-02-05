import jwt, { Secret } from 'jsonwebtoken'

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret

export function generateToken(payload: {
  id: number
  name?: string
  email: string
  role?: string
}) {
  return jwt.sign(
    payload as { id: number; name?: string; email: string; role?: string },
    JWT_SECRET,
    {
      expiresIn: '7d',
    },
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: number
      name: string
      email: string
      role?: string
    }
  } catch (error) {
    return null
  }
}
