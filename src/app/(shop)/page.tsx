import { ProductList } from '@/components/products/ProductsList'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('Home')
  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <div className='max-w-375 mx-auto px-4 lg:px-10 pt-10'>
        <HeroCarousel />

        <div className=''>
          <h2 className='text-2xl font-bold mb-6'>{t('featuredProducts')}</h2>
          <ProductList endpoint='/api/products' mode='shop' />
        </div>
      </div>
    </div>
  )
}
