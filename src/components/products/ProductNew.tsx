'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, ChangeEvent, FormEvent } from 'react'
import { useEffect } from 'react'

type Category = {
  id: number
  name: string
}

type ProductFormData = {
  name: string
  description: string
  price: string
  reference: string
  stock: string
  categoryId: string
}

export default function ProductForm() {
  const [form, setForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    reference: '',
    stock: '',
    categoryId: '',
  })

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!image) {
      alert('Image is required')
      return
    }

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value)
    })
    formData.append('image', image)

    setLoading(true)

    const res = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    })

    setLoading(false)

    if (!res.ok) {
      alert('Error creating product')
      return
    }

    alert('Product created successfully')

    setForm({
      name: '',
      description: '',
      price: '',
      reference: '',
      stock: '',
      categoryId: '',
    })
    setImage(null)
    setPreview(null)
  }

  return (
    <div className='min-h-screen bg-slate-950 text-white flex justify-center px-6 py-12'>
      <div className='w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6'>
        <div className='grid grid-cols-3 justify-between'>
          <motion.button
            onClick={() => router.push('/admin')}
            className='flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors text-sm font-medium'
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={18} /> Back
          </motion.button>
          <h2 className='text-xl font-semibold text-center'>Create product</h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-3xl bg-slate-900 rounded-2xl p-6 space-y-6'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <p className='ps-1 text-sm text-slate-400'>Name</p>
              <input
                name='name'
                placeholder='Product name'
                value={form.name}
                onChange={handleChange}
                className='input'
                required
              />
            </div>

            <div className='space-y-2'>
              <p className='ps-1 text-sm text-slate-400'>Reference</p>
              <input
                name='reference'
                placeholder='Reference'
                value={form.reference}
                onChange={handleChange}
                className='input'
                required
              />
            </div>

            <div className='space-y-2'>
              <p className='ps-1 text-sm text-slate-400'>Price</p>
              <input
                name='price'
                type='number'
                step='0.01'
                placeholder='Price'
                value={form.price}
                onChange={handleChange}
                className='input'
                required
              />
            </div>

            <div className='space-y-2'>
              <p className='ps-1 text-sm text-slate-400'>Stock</p>
              <input
                name='stock'
                type='number'
                placeholder='Stock'
                value={form.stock}
                onChange={handleChange}
                className='input'
                required
              />
            </div>

            <div className='space-y-2'>
              <p className='ps-1 text-sm text-slate-400'>Category</p>
              <select
                name='categoryId'
                value={form.categoryId}
                onChange={handleChange}
                className='input'
                required
              >
                <option value='' disabled>
                  Select category
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='ps-1 text-sm text-slate-400'>Description</p>
            <textarea
              name='description'
              placeholder='Description'
              value={form.description}
              onChange={handleChange}
              rows={4}
              className='input'
              required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <label className='flex flex-col gap-2 ps-1 text-sm text-slate-400'>
              Product image
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='file'
                required
              />
            </label>

            {preview && (
              <Image
                src={preview}
                alt='Preview'
                width={400}
                height={400}
                className='h-48 w-full rounded-xl object-cover border border-slate-800'
              />
            )}
          </div>

          <footer className='flex justify-end pt-4'>
            <button
              disabled={loading}
              className='px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50'
            >
              {loading ? 'Uploading...' : 'Create product'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
