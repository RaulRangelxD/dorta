import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Nombre muy corto'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
export const forgotPasswordSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
})

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
