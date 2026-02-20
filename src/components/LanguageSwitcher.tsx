'use client'

import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

type Props = {
  availableLocales?: ('en' | 'es')[]
  className?: string
}

export function LanguageSwitcher({
  availableLocales = ['en', 'es'],
  className,
}: Props) {
  const router = useRouter()

  const changeLocale = (locale: 'en' | 'es') => {
    Cookies.set('locale', locale, { path: '/', expires: 365 })
    router.refresh()
  }

  return (
    <div className={className || 'flex gap-2'}>
      {availableLocales.map((locale) => (
        <button
          key={locale}
          onClick={() => changeLocale(locale)}
          className='px-2 py-1 rounded hover:bg-blue-500/50 transition-colors'
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
