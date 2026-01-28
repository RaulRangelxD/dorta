'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import {
  ChevronLeft,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Info,
  PackageSearch,
} from 'lucide-react';
import Image from 'next/image';

// Tipos para TypeScript
interface Product {
  id: number;
  name: string;
  price?: number; // Por si luego añades precios
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
  const { id } = useParams(); // Captura el ID de la URL
  const router = useRouter();
  const [data, setData] = useState<CategoryWithProducts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        // Consultamos la API de categorías
        const res = await fetch('/api/categories');
        const categories: CategoryWithProducts[] = await res.json();

        // Buscamos la categoría específica por el ID
        const selected = categories.find((c) => c.id === Number(id));
        setData(selected || null);
      } catch (error) {
        console.error('Error cargando productos:', error);
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
        <p className='text-slate-400'>Categoría no encontrada</p>
        <button
          onClick={() => router.push('/categories')}
          className='text-blue-500 hover:underline'
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#020817] text-slate-100 pb-20'>
      {/* Header Detalle */}
      <div className='bg-[#0b1120] border-b border-slate-800 p-6 sticky top-0 z-40 backdrop-blur-sm bg-opacity-80'>
        <div className='max-w-5xl mx-auto flex items-center justify-between'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-slate-400 hover:text-white transition-colors'
          >
            <ArrowLeft size={20} />
            <span className='text-sm font-medium'>Volver a Categorías</span>
          </button>
          <div className='flex gap-4'>
            <ShoppingCart className='w-5 h-5 text-slate-400' />
          </div>
        </div>
      </div>

      <main className='max-w-5xl mx-auto px-6 mt-12'>
        <header className='mb-12'>
          <h1 className='text-4xl font-bold text-white mb-2'>{data.name}</h1>
          <p className='text-slate-500'>
            Mostrando {data.products.length} repuestos disponibles en
            inventario.
          </p>
        </header>

        {/* LISTA DE PRODUCTOS */}
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
                className='bg-[#0b1120] border border-slate-800 p-5 rounded-2xl flex items-center justify-between group hover:border-blue-600/50 transition-all'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800'>
                    {/* --- AQUÍ PUEDES PONER UNA IMAGEN MINIATURA DEL PRODUCTO --- */}
                    <Info
                      size={20}
                      className='text-slate-600 group-hover:text-blue-500 transition-colors'
                    />
                  </div>
                  <div>
                    <h3 className='font-bold text-white'>{product.name}</h3>
                    <p className='text-xs text-slate-500'>
                      ID: REP-{product.id}00
                    </p>
                  </div>
                </div>

                <button className='px-5 py-2 bg-slate-900 border border-slate-800 hover:border-blue-600 hover:bg-blue-600/10 text-xs font-bold rounded-xl transition-all'>
                  Ver Detalles
                </button>
              </motion.div>
            ))
          ) : (
            <div className='text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800'>
              <p className='text-slate-500 italic'>
                Aún no hay productos en esta categoría.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
