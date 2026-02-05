import { ProductList } from '@/components/products/ProductsList'

export default function HomePage() {
  return (
    <div className='min-h-full bg-slate-950 text-white'>
      <div className='w-full mx-auto px-1 lg:px-4 pt-10'>
        <ProductList endpoint='/api/products' mode='shop' />
      </div>
    </div>
  )
}
