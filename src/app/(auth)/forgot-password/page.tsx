'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Loader2, ChevronLeft, KeyRound } from 'lucide-react'
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '@/lib/validations/auth'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSent(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300'>
      <main className='flex-1 flex flex-col items-center justify-center p-4 py-12 relative max-w-7xl mx-auto w-full'>
        <button
          onClick={() => router.back()}
          className='mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors font-semibold text-sm self-start md:absolute md:left-4 md:top-8'
        >
          <ChevronLeft className='w-5 h-5' />
          Back
        </button>

        <div className='w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden'>
          <div className='p-8 pt-12 flex flex-col items-center'>
            <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6'>
              <KeyRound className='w-8 h-8' />
            </div>

            <h1 className='text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white'>
              Forgot Password?
            </h1>
            <p className='text-slate-500 dark:text-slate-400 mt-2 mb-10 text-center text-sm font-medium'>
              Enter your email to reset your password.
            </p>

            {!isSent ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-full space-y-6'
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

                <button
                  disabled={isLoading}
                  type='submit'
                  className='w-full bg-[#1d61f2] hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg flex justify-center items-center'
                >
                  {isLoading ? (
                    <Loader2 className='animate-spin h-5 w-5' />
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            ) : (
              <div className='text-center space-y-4 w-full'>
                <div className='bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-lg text-sm font-medium'>
                  Check your inbox! We've sent an email to your address.
                </div>
                <button
                  onClick={() => setIsSent(false)}
                  className='text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline'
                >
                  Try another email
                </button>
              </div>
            )}
          </div>

          <div className='bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-200 dark:border-slate-800 text-center'>
            <p className='text-sm text-slate-600 dark:text-slate-400 font-medium'>
              Remembered?{' '}
              <Link
                href='/login'
                className='text-blue-600 dark:text-blue-400 font-bold hover:underline'
              >
                Back to Login
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
