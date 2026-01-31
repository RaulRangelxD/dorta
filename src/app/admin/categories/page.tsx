'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Edit2,
  Trash2,
  Plus,
  Loader2,
  Upload,
  X,
  User,
  ArrowLeft,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  department: string;
  description: string | null;
  image: string | null;
  products?: any[];
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const departments = [
    'Major Appliances',
    'Tools & Repair',
    'Climate Control',
    'Electronics',
    'Care & Cleaning',
  ];

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        formRef.current?.reset();
        await fetchCategories(); // Refrescar lista
      }
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setUploading(false);
    }
  }

  async function deleteCategory(id: number) {
    if (
      !confirm(
        '¿Estás seguro de borrar esta categoría? Los productos asociados podrían quedar huérfanos.',
      )
    )
      return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  }

  return (
    <div className='min-h-screen bg-[#020817] text-slate-100 p-6 lg:p-12'>
      <header className='max-w-6xl mx-auto mb-12 flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <Link
            href='/admin'
            className='p-2 bg-slate-900 rounded-full border border-slate-800 hover:bg-slate-800 transition-colors'
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className='text-3xl font-bold tracking-tight'>Categorías</h1>
        </div>

        <div className='flex items-center gap-4 bg-[#0b1120] border border-slate-800 p-2 pl-4 rounded-2xl'>
          <div className='text-right hidden sm:block'>
            <p className='text-[10px] font-bold text-blue-500 uppercase'>
              Admin Mode
            </p>
            <p className='text-xs text-slate-300'>Dorta Control</p>
          </div>
          <div className='w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20'>
            <User size={20} />
          </div>
        </div>
      </header>

      <main className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10'>
        {/* FORMULARIO */}
        <aside className='lg:col-span-4'>
          <div className='bg-[#0b1120] border border-slate-800 rounded-[2rem] p-8 sticky top-8'>
            <h2 className='text-lg font-bold mb-6 flex items-center gap-2'>
              {editingCategory ? (
                <Edit2 size={18} className='text-blue-500' />
              ) : (
                <Plus size={18} className='text-blue-500' />
              )}
              {editingCategory ? 'Editar' : 'Nueva'} Categoría
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block'>
                  Nombre
                </label>
                <input
                  name='name'
                  required
                  placeholder='Ej: Compresores'
                  defaultValue={editingCategory?.name}
                  className='w-full bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/50 transition-all'
                />
              </div>

              <div>
                <label className='text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block'>
                  Departamento
                </label>
                <select
                  name='department'
                  required
                  defaultValue={editingCategory?.department || ''}
                  className='w-full bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/50 appearance-none'
                >
                  <option value='' disabled>
                    Seleccionar departamento
                  </option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block'>
                  Descripción
                </label>
                <textarea
                  name='description'
                  rows={3}
                  placeholder='Breve descripción...'
                  defaultValue={editingCategory?.description || ''}
                  className='w-full bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600/50 resize-none'
                />
              </div>

              <div>
                <label className='text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block'>
                  Imagen
                </label>
                <div className='relative h-40 w-full bg-[#020817] border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center overflow-hidden group transition-colors hover:border-blue-500/50'>
                  {preview || editingCategory?.image ? (
                    <Image
                      src={preview || editingCategory?.image || ''}
                      alt='Preview'
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex flex-col items-center gap-2 text-slate-600 group-hover:text-blue-500 transition-colors'>
                      <Upload size={24} />
                      <span className='text-[10px] font-medium'>
                        Subir archivo
                      </span>
                    </div>
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
              </div>

              <div className='flex gap-2 pt-4'>
                <button
                  disabled={uploading}
                  className='flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20'
                >
                  {uploading ? (
                    <Loader2 className='animate-spin mx-auto' size={18} />
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
                      formRef.current?.reset();
                    }}
                    className='p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors'
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        {/* LISTADO */}
        <section className='lg:col-span-8 space-y-4'>
          {loading ? (
            <div className='flex justify-center py-20'>
              <Loader2 className='animate-spin text-blue-600' size={40} />
            </div>
          ) : categories.length === 0 ? (
            <div className='text-center py-20 bg-[#0b1120] rounded-[2rem] border border-dashed border-slate-800'>
              <p className='text-slate-500'>
                No hay categorías creadas todavía.
              </p>
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className='bg-[#0b1120] border border-slate-800 p-5 rounded-[2rem] flex items-center gap-6 group hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-black/20'
              >
                <div className='relative w-24 h-24 rounded-2xl overflow-hidden bg-black shadow-inner shrink-0 border border-slate-800'>
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-slate-900 text-slate-700'>
                      <ImageIcon size={28} />
                    </div>
                  )}
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase rounded-lg border border-blue-500/20'>
                      {cat.department}
                    </span>
                    <h3 className='font-bold text-lg text-slate-100 truncate'>
                      {cat.name}
                    </h3>
                  </div>
                  <p className='text-sm text-slate-500 line-clamp-1 mb-3'>
                    {cat.description || 'Sin descripción.'}
                  </p>
                  <div className='flex items-center gap-4'>
                    <span className='text-xs text-slate-400 flex items-center gap-1.5'>
                      <Tag size={14} className='text-blue-500' />{' '}
                      {cat.products?.length || 0} Productos
                    </span>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setPreview(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className='p-3 bg-slate-900 rounded-xl text-slate-400 hover:text-blue-400 border border-slate-800 hover:border-blue-500/30 transition-all'
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className='p-3 bg-slate-900 rounded-xl text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/30 transition-all'
                  >
                    <Trash2 size={18} />
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
