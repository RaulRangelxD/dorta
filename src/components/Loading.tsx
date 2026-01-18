'use client'

import { Loader2 } from 'lucide-react'

type LoadingProps = {
  size?: number
  text?: string
  className?: string
}

const Loading = ({ size = 48, text, className = '' }: LoadingProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <Loader2
        className='animate-spin text-blue-600 dark:text-blue-400'
        size={size}
      />
      {text && (
        <span className='text-sm text-slate-700 dark:text-slate-300'>
          {text}
        </span>
      )}
    </div>
  )
}

export default Loading
