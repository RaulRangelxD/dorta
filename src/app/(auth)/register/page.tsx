'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Mail,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      router.push('/login?registered=success')
    } catch (error) {
      alert(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300'>
      {/* Navbar */}
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

        <div className='hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400'>
          <Link href='/' className='hover:text-blue-600 transition-colors'>
            Home
          </Link>
          <Link
            href='/products'
            className='hover:text-blue-600 transition-colors'
          >
            Products
          </Link>
          <Link
            href='/login'
            className='bg-[#1d61f2] text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm'
          >
            Log In
          </Link>
        </div>
      </nav>

      <main className='flex flex-col items-center justify-center p-4 py-12 relative max-w-7xl mx-auto'>
        <button
          onClick={() => router.back()}
          className='mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors font-semibold text-sm self-start md:absolute md:left-4 md:top-8'
        >
          <ChevronLeft className='w-5 h-5' />
          Back
        </button>

        <div className='w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-8 md:mt-0'>
          <div className='p-8 pt-12 flex flex-col items-center'>
            <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6'>
              <User className='w-8 h-8' />
            </div>

            <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-white'>
              Create Account
            </h1>
            <p className='text-slate-500 dark:text-slate-400 mt-2 mb-10 text-center text-sm font-medium'>
              Join us to manage your orders and more
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className='w-full space-y-5 text-left'
            >
              {/* Full Name */}
              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300'>
                  Full Name
                </label>
                <div className='relative'>
                  <User
                    className={`absolute left-3 top-3.5 w-5 h-5 ${
                      errors.fullName
                        ? 'text-red-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <input
                    {...register('fullName')}
                    type='text'
                    placeholder='John Doe'
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border rounded-lg outline-none transition-all ${
                      errors.fullName
                        ? 'border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/20'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    } dark:text-white`}
                  />
                </div>
                {errors.fullName && (
                  <p className='text-red-500 text-xs font-medium'>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
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
                    className={`w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border rounded-lg outline-none transition-all ${
                      errors.password
                        ? 'border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/20'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    } dark:text-white`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors'
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-red-500 text-xs font-medium'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <Lock
                    className={`absolute left-3 top-3.5 w-5 h-5 ${
                      errors.confirmPassword
                        ? 'text-red-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='••••••••'
                    className={`w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border rounded-lg outline-none transition-all ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/20'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    } dark:text-white`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='text-red-500 text-xs font-medium'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                disabled={isLoading}
                type='submit'
                className='w-full bg-[#1d61f2] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex justify-center items-center'
              >
                {isLoading ? (
                  <Loader2 className='animate-spin h-5 w-5' />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className='relative w-full my-8'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-slate-200 dark:border-slate-800'></div>
              </div>
              <div className='relative flex justify-center text-[10px] uppercase tracking-widest'>
                <span className='bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold'>
                  Or register with
                </span>
              </div>
            </div>

            <button className='w-full flex items-center justify-center gap-3 border border-slate-300 dark:border-slate-700 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-slate-200 text-sm active:scale-[0.98]'>
              <Image
                src='https://www.svgrepo.com/show/475656/google-color.svg'
                width={20}
                height={20}
                alt='Google logo'
              />
              Continue with Google
            </button>
          </div>

          <div className='bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-800 text-center'>
            <p className='text-sm text-slate-600 dark:text-slate-400 font-medium'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-blue-600 dark:text-blue-400 font-bold hover:underline'
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>

        <footer className='mt-12 text-slate-400 dark:text-slate-600 text-[11px] text-center uppercase tracking-tighter'>
          © 2026 Created by Raul & Alejandra.
        </footer>
      </main>
    </div>
  )
}
