'use client'

import { ProductCard } from '@/components/cards/ProductCard/ProductCard'

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <h2>HOME</h2>
      <ProductCard
        product={{
          id: 1,
          name: 'Tornillo',
          description: 'a',
          price: 20,
          reference: 'a',
          categoryId: 1,
          stock: 1,
          category: { id: 1, name: 'name' },
          img: 'a',
          createdAt: 'a',
          updatedAt: 'a',
        }}
        info={
          <ProductCard.Info>
            <ProductCard.Name />
            <ProductCard.Price />
          </ProductCard.Info>
        }
        action={<ProductCard.Action />}
      />
    </div>
  )
}
