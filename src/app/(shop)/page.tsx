import { ProductList } from '@/components/products/ProductsList'
import { HeroCarousel } from '@/components/home/HeroCarousel'

export default function HomePage() {
  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <div className='max-w-375 mx-auto px-4 lg:px-10 pt-10'>
        <HeroCarousel />

        <div className=''>
          <h2 className='text-2xl font-bold mb-6'>Latest Arrivals</h2>
          <ProductList endpoint='/api/products' mode='shop' />
        </div>
      </div>
    </div>
  )
}
