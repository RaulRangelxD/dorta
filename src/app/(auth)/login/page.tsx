'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Loader2, Eye, EyeOff, ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [registeredSuccess, setRegisteredSuccess] = useState(false)
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    if (params?.get('registered') === 'success') {
      setRegisteredSuccess(true)
    }
  }, [params])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      const resData = await response.json()
      document.cookie = `token=${resData.token}; path=/; max-age=86400; secure; samesite=strict`

      router.push('/')
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300'>
      <nav className='w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10'>
        <Link href='/'>
          <Image
            src='/LOGO.png'
            alt='Dorta Logo'
            width={120}
            height={40}
            className='h-10 w-auto object-contain dark:brightness-110'
            priority
          />
        </Link>
      </nav>

      <main className='flex flex-col items-center justify-center p-4 py-12 relative max-w-7xl mx-auto'>
        <button
          onClick={() => router.back()}
          className='mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors font-semibold text-sm self-start md:absolute md:left-4 md:top-8'
        >
          <ChevronLeft className='w-5 h-5' />
          Back
        </button>

        {registeredSuccess && (
          <div className='mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3 text-sm font-semibold'>
            Se ha registrado satisfactoriamente
          </div>
        )}

        <div className='w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-8 md:mt-0'>
          <div className='p-8 pt-12 flex flex-col items-center'>
            <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6'>
              <Mail className='w-8 h-8' />
            </div>

            <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
              Welcome Back
            </h1>
            <p className='text-slate-500 dark:text-slate-400 mt-2 mb-10 text-center text-sm font-medium'>
              Sign in to your account
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='w-full space-y-5'
            >
              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300'>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail
                    className={`absolute left-3 top-3.5 w-5 h-5 ${
                      errors.email
                        ? 'text-red-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <input
                    {...register('email')}
                    type='email'
                    placeholder='name@company.com'
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border rounded-lg outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/20'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    } dark:text-white`}
                  />
                </div>
                {errors.email && (
                  <p className='text-red-500 text-xs font-medium'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300'>
                  Password
                </label>
                <div className='relative'>
                  <Lock
                    className={`absolute left-3 top-3.5 w-5 h-5 ${
                      errors.password
                        ? 'text-red-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    className='w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between text-sm font-semibold'>
                <label className='flex items-center text-slate-600 dark:text-slate-400 cursor-pointer'>
                  <input
                    {...register('rememberMe')}
                    type='checkbox'
                    className='mr-2 h-4 w-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                  />
                  Remember me
                </label>
                <Link
                  href='/forgot-password'
                  className='text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Forgot password?
                </Link>
              </div>

              <button
                disabled={isLoading}
                type='submit'
                className='w-full bg-[#1d61f2] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg flex justify-center items-center transition-all shadow-lg active:scale-[0.98] disabled:opacity-70'
              >
                {isLoading ? (
                  <Loader2 className='animate-spin h-5 w-5' />
                ) : (
                  'Log In'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
