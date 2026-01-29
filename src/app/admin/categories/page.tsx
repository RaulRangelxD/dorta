'use client';

import { useState, useEffect } from 'react';
import {
  Edit2,
  Trash2,
  Plus,
  Loader2,
  Upload,
  X,
  Check,
  User,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Definición de tipo para evitar 'any'
interface Category {
  id: number;
  name: string;
  image: string | null;
  products?: { id: number }[];
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const url = editingCategory
      ? `/api/categories?id=${editingCategory.id}`
      : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setEditingCategory(null);
        setPreview(null);
        (e.target as HTMLFormElement).reset();
        const fresh = await fetch('/api/categories');
        setCategories(await fresh.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm('¿Borrar categoría?')) return;
    try {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className='min-h-screen bg-[#020817] text-slate-100 p-6 lg:p-12'>
      <header className='max-w-6xl mx-auto mb-12 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link
            href='/'
            className='p-2 bg-slate-900 rounded-full border border-slate-800 hover:bg-slate-800 transition-colors'
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className='text-3xl font-bold'>Categorías</h1>
        </div>
        <div className='flex items-center gap-4 bg-[#0b1120] border border-slate-800 p-2 pl-4 rounded-2xl'>
          <div className='text-right hidden sm:block'>
            <p className='text-[10px] font-bold text-blue-500 uppercase'>
              Admin Mode
            </p>
            <p className='text-xs text-slate-300'>Dorta Control</p>
          </div>
          <div className='w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center'>
            <User size={20} />
          </div>
        </div>
      </header>

      <main className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10'>
        <aside className='lg:col-span-4'>
          <div className='bg-[#0b1120] border border-slate-800 rounded-4xl p-8 sticky top-10'>
            <h2 className='text-lg font-bold mb-6 flex items-center gap-2'>
              <Plus size={18} className='text-blue-500' />{' '}
              {editingCategory ? 'Editar' : 'Nueva'} Categoría
            </h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <input
                name='name'
                required
                placeholder='Nombre'
                defaultValue={editingCategory?.name}
                className='w-full bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-600'
              />
              <div className='relative h-40 w-full bg-[#020817] border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center overflow-hidden group'>
                {/* Solución al error de Image */}
                {preview || editingCategory?.image ? (
                  <Image
                    src={preview || editingCategory?.image || ''}
                    alt='Preview'
                    fill
                    className='object-cover'
                  />
                ) : (
                  <Upload
                    className='text-slate-600 group-hover:text-blue-500'
                    size={24}
                  />
                )}
                <input
                  type='file'
                  name='image'
                  required={!editingCategory}
                  className='absolute inset-0 opacity-0 cursor-pointer'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
              <div className='flex gap-2'>
                <button
                  disabled={uploading}
                  className='flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all'
                >
                  {uploading ? (
                    <Loader2 className='animate-spin mx-auto' size={18} />
                  ) : editingCategory ? (
                    <Check size={18} className='mx-auto' />
                  ) : (
                    'Guardar'
                  )}
                </button>
                {editingCategory && (
                  <button
                    type='button'
                    onClick={() => {
                      setEditingCategory(null);
                      setPreview(null);
                    }}
                    className='p-4 bg-slate-800 rounded-xl hover:bg-slate-700'
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        <section className='lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit'>
          {loading ? (
            <Loader2 className='animate-spin text-blue-600 mx-auto col-span-2' />
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className='bg-[#0b1120] border border-slate-800 p-5 rounded-4xl flex items-center justify-between group hover:border-slate-600 transition-all'
              >
                <div className='flex items-center gap-4'>
                  <div className='relative w-14 h-14 rounded-xl overflow-hidden bg-black shadow-lg shrink-0'>
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-slate-900 text-slate-700'>
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className='font-bold text-sm text-slate-200'>
                      {cat.name}
                    </h3>
                    {/* Solución al error de .length */}
                    <p className='text-[10px] text-slate-500 uppercase'>
                      {cat.products?.length || 0} Productos
                    </p>
                  </div>
                </div>
                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setPreview(null);
                    }}
                    className='p-2 bg-[#020817] rounded-lg text-slate-400 hover:text-blue-400'
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className='p-2 bg-[#020817] rounded-lg text-slate-400 hover:text-red-400'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
