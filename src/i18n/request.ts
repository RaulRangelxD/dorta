import { getRequestConfig } from 'next-intl/server'
import { headers, cookies } from 'next/headers'

const locales = ['en', 'es']
const defaultLocale = 'es'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headerStore = await headers()

  // 1️⃣ Prioridad: cookie
  const cookieLocale = cookieStore.get('locale')?.value

  if (cookieLocale && locales.includes(cookieLocale)) {
    return {
      locale: cookieLocale,
      messages: (await import(`../../messages/${cookieLocale}.json`)).default,
    }
  }

  // 2️⃣ Detectar desde navegador
  const acceptLanguage = headerStore.get('accept-language')

  const detected = acceptLanguage?.split(',')[0].split('-')[0] ?? defaultLocale

  const locale = locales.includes(detected) ? detected : defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
