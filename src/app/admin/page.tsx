import { ProductList } from '@/components/products/ProductsList'

export default function AdminProductsPage() {
  return (
    <div className='min-h-screen bg-slate-950 text-white'>
      <div className='max-w-7xl mx-auto px-6 pt-10'>
        <ProductList endpoint='/api/products' mode='admin' />
      </div>
    </div>
  )
}
