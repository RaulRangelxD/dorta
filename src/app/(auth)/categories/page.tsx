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
  Refrigerator, // Usamos este en lugar de Kitchen
  Wrench,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Definición de tipos para evitar errores de TypeScript
interface Product {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

// Variantes de animación corregidas para Framer Motion
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
    transition: { duration: 0.4 },
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
        if (!res.ok) throw new Error('Error en la carga');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCats();
  }, []);

  return (
    <div className='min-h-screen bg-[#020817] text-slate-100 font-sans'>
      {/* NAVBAR */}
      <nav className='border-b border-slate-800 bg-[#020817]/95 backdrop-blur-md sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-8'>
            <Link href='/'>
              {/* --- AGREGA TU LOGO AQUÍ --- */}
              <div className='relative w-[100px] h-[35px]'>
                <Image
                  src='/LOGO.png'
                  alt='Dorta Logo'
                  fill
                  className='object-contain'
                />
              </div>
            </Link>
          </div>

          <div className='hidden md:flex flex-1 max-w-md mx-8 relative'>
            <Search className='absolute left-3 top-2.5 w-4 h-4 text-slate-500' />
            <input
              type='text'
              placeholder='Buscar por repuesto o modelo...'
              className='w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-white'
            />
          </div>

          <div className='flex items-center gap-5 text-slate-400'>
            <ShoppingCart className='w-5 h-5 hover:text-white cursor-pointer transition-colors' />
            <User className='w-5 h-5 hover:text-white cursor-pointer transition-colors' />
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto p-6 py-10'>
        {/* BOTÓN VOLVER */}
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-slate-500 hover:text-blue-400 mb-8 transition-colors text-sm font-medium'
        >
          <ChevronLeft size={18} /> Back
        </button>

        <header className='mb-12'>
          <h1 className='text-4xl font-bold tracking-tight text-white mb-3'>
            Categorías de Repuestos
          </h1>
          <p className='text-slate-400 text-lg'>
            Encuentra la pieza exacta para tus equipos.
          </p>
        </header>

        <div className='flex flex-col lg:flex-row gap-8'>
          {/* SIDEBAR */}
          <aside className='w-full lg:w-64 shrink-0'>
            <div className='bg-[#0b1120] border border-slate-800 rounded-2xl p-6 sticky top-24'>
              <h3 className='text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6'>
                Departamentos
              </h3>
              <nav className='space-y-2'>
                <button className='w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600/10 text-blue-500 font-bold text-sm'>
                  <Refrigerator size={18} /> Línea Blanca
                </button>
                <button className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors font-medium text-sm'>
                  <Wrench size={18} /> Herramientas
                </button>
              </nav>
            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL */}
          <div className='flex-1'>
            {isLoading ? (
              <div className='flex flex-col items-center justify-center py-20'>
                <Loader2 className='w-10 h-10 text-blue-600 animate-spin mb-4' />
                <p className='text-slate-500 text-sm'>
                  Sincronizando base de datos...
                </p>
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
                    whileHover={{ y: -5 }}
                    className='group bg-[#0b1120] border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all shadow-xl'
                  >
                    {/* --- CONTENEDOR DE IMAGEN --- */}
                    <div className='h-48 bg-slate-900/50 relative flex items-center justify-center border-b border-slate-800/50'>
                      {/* Descomenta y agrega tu ruta de imagen aquí:
                      <Image 
                        src={`/categories/${cat.id}.jpg`} 
                        alt={cat.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      /> 
                      */}
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
                        {cat.products.length} productos registrados.
                      </p>

                      <Link
                        href={`/categories/${cat.id}`}
                        className='flex items-center justify-between w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20'
                      >
                        Ver Piezas
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* BANNER INFERIOR */}
            <div className='mt-16 bg-gradient-to-br from-blue-700 to-blue-950 rounded-3xl p-10 relative overflow-hidden shadow-2xl border border-blue-500/20'>
              <div className='relative z-10'>
                <h2 className='text-3xl font-bold text-white mb-4'>
                  ¿No encuentras el repuesto?
                </h2>
                <p className='text-blue-100 max-w-md mb-8'>
                  Usa el buscador por número de modelo para obtener el diagrama
                  exacto de tu equipo.
                </p>
                <div className='flex flex-wrap gap-4'>
                  <button className='bg-white text-blue-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all text-sm'>
                    Búsqueda por Modelo
                  </button>
                </div>
              </div>
              {/* Decoración de fondo */}
              <Search className='absolute right-[-40px] bottom-[-40px] w-80 h-80 text-white opacity-5 rotate-12' />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
