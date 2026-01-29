'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import {
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Info,
  PackageSearch,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price?: number;
}

interface CategoryWithProducts {
  id: number;
  name: string;
  products: Product[];
}

const containerVars: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVars: Variants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export default function CategoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<CategoryWithProducts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch('/api/categories');
        const categories: CategoryWithProducts[] = await res.json();
        const selected = categories.find((c) => c.id === Number(id));
        setData(selected || null);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen bg-[#020817] flex items-center justify-center'>
        <Loader2 className='w-8 h-8 text-blue-500 animate-spin' />
      </div>
    );
  }

  if (!data) {
    return (
      <div className='min-h-screen bg-[#020817] text-white flex flex-col items-center justify-center gap-4'>
        <PackageSearch size={64} className='text-slate-700' />
        <p className='text-slate-400'>Category not found</p>
        <button
          onClick={() => router.push('/categories')}
          className='text-blue-500 hover:underline'
        >
          Back to catalog
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#020817] text-slate-100 pb-20'>
      {/* BRANDED NAVBAR - COLOR #0b1120 */}
      <nav className='w-full bg-[#0b1120] border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50'>
        <div className='flex items-center gap-8'>
          <Link href='/'>
            <Image
              src='/LOGO.png'
              alt='Dorta Logo'
              width={120}
              height={40}
              className='h-10 w-auto object-contain brightness-110'
              priority
            />
          </Link>
        </div>

        <div className='flex items-center gap-6 text-slate-400'>
          <ShoppingCart className='w-5 h-5 hover:text-white cursor-pointer transition-colors' />
          <User className='w-5 h-5 hover:text-white cursor-pointer transition-colors' />
        </div>
      </nav>

      <main className='max-w-5xl mx-auto px-6 mt-12'>
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group'
        >
          <ArrowLeft
            size={18}
            className='group-hover:-translate-x-1 transition-transform'
          />
          <span className='text-sm font-medium'>Back to Categories</span>
        </button>

        <header className='mb-12'>
          <h1 className='text-4xl font-bold text-white mb-2'>{data.name}</h1>
          <p className='text-slate-500'>
            Showing {data.products.length} spare parts available in stock.
          </p>
        </header>

        {/* PRODUCT LIST */}
        <motion.div
          variants={containerVars}
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 gap-4'
        >
          {data.products.length > 0 ? (
            data.products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVars}
                className='bg-[#0b1120] border border-slate-800 p-5 rounded-2xl flex items-center justify-between group hover:border-blue-600/50 transition-all shadow-lg'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-14 h-14 bg-[#020817] rounded-xl flex items-center justify-center border border-slate-800'>
                    <Info
                      size={24}
                      className='text-slate-600 group-hover:text-blue-500 transition-colors'
                    />
                  </div>
                  <div>
                    <h3 className='font-bold text-white group-hover:text-blue-400 transition-colors'>
                      {product.name}
                    </h3>
                    <p className='text-xs text-slate-500 mt-1'>
                      SKU: PART-{product.id}00
                    </p>
                  </div>
                </div>

                <button className='px-6 py-2.5 bg-[#020817] border border-slate-800 hover:border-blue-600 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md'>
                  View Details
                </button>
              </motion.div>
            ))
          ) : (
            <div className='text-center py-20 bg-[#0b1120]/50 rounded-3xl border border-dashed border-slate-800'>
              <p className='text-slate-500 italic'>
                No products found in this category yet.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
