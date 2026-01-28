'use client';

import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  ChevronLeft,
  Package,
  Search,
  ShoppingCart,
  User,
  ArrowRight,
  Loader2,
  Refrigerator, // Usamos Refrigerator en lugar de Kitchen para evitar el error ts(2305)
  Wrench,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Definimos interfaces para evitar el error "Unexpected any"
interface Product {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

// Corregimos los tipos de Variants para evitar errores de Framer Motion
const containerVars: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVars: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }, // ease debe ser un string válido
  },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Loading error');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCats();
  }, []);

  return (
    <div className='min-h-screen bg-[#020817] text-slate-100 font-sans'>
      {/* NAVBAR CON EL AZUL CLARO DE TU CAPTURA (#0b1120) */}
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

        {/* SEARCH BAR INTEGRADA */}
        <div className='hidden md:flex flex-1 max-w-md mx-8 relative'>
          <Search className='absolute left-3 top-2.5 w-4 h-4 text-slate-500' />
          <input
            type='text'
            placeholder='Search by part or model...'
            className='w-full pl-10 pr-4 py-2 bg-[#020817] border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-white'
          />
        </div>

        <div className='flex items-center gap-6 text-slate-400'>
          <ShoppingCart className='w-5 h-5 hover:text-white cursor-pointer transition-colors' />
          <User className='w-5 h-5 hover:text-white cursor-pointer transition-colors' />
        </div>
      </nav>

      <main className='max-w-7xl mx-auto p-6 py-10'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-slate-500 hover:text-blue-400 mb-8 transition-colors text-sm font-medium'
        >
          <ChevronLeft size={18} /> Back
        </button>

        <header className='mb-12'>
          <h1 className='text-4xl font-bold tracking-tight text-white mb-3'>
            Spare Part Categories
          </h1>
          <p className='text-slate-400 text-lg'>
            Find the exact part for your equipment.
          </p>
        </header>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* SIDEBAR CON EL MISMO AZUL (#0b1120) */}
          <aside className='w-full lg:w-64 shrink-0'>
            <div className='bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sticky top-28'>
              <h3 className='text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6'>
                Departments
              </h3>
              <nav className='space-y-2'>
                <button className='w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-500 font-bold text-sm'>
                  <Refrigerator size={18} /> Major Appliances
                </button>
                <button className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors font-medium text-sm'>
                  <Wrench size={18} /> Tools & Repair
                </button>
              </nav>
            </div>
          </aside>

          {/* MAIN GRID */}
          <div className='flex-1'>
            {isLoading ? (
              <div className='flex flex-col items-center justify-center py-20'>
                <Loader2 className='w-10 h-10 text-blue-600 animate-spin mb-4' />
                <p className='text-slate-500 text-sm'>Syncing database...</p>
              </div>
            ) : (
              <motion.div
                variants={containerVars}
                initial='hidden'
                animate='visible'
                className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              >
                {categories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    variants={itemVars}
                    className='group bg-[#0b1120] border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all shadow-xl'
                  >
                    <div className='h-48 bg-[#020817] relative flex items-center justify-center border-b border-slate-800/50'>
                      <Package
                        size={48}
                        className='text-slate-800 group-hover:text-blue-600 transition-colors'
                      />
                    </div>
                    <div className='p-6'>
                      <h3 className='text-xl font-bold text-white mb-2'>
                        {cat.name}
                      </h3>
                      <p className='text-slate-500 text-sm mb-6'>
                        {cat.products.length} items listed.
                      </p>
                      <Link
                        href={`/categories/${cat.id}`}
                        className='flex items-center justify-between w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all'
                      >
                        View Parts <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
