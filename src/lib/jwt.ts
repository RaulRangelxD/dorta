import jwt, { Secret } from 'jsonwebtoken'

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret

export function generateToken(payload: { id: number; email: string }) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}
