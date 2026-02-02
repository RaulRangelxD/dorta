'use client'

import Image from 'next/image'
import { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'

type ProductFormData = {
  name: string
  description: string
  price: string
  reference: string
  stock: string
  categoryId: string
}

type ProductResponse = {
  id: number
  name: string
  description: string
  price: number
  reference: string
  stock: number
  categoryId: number
  img: string | null
}

export default function ProductEditForm() {
  const { id } = useParams()
  const router = useRouter()

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
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products?id=${id}`)
      const product: ProductResponse = await res.json()

      setForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        reference: product.reference,
        stock: product.stock.toString(),
        categoryId: product.categoryId.toString(),
      })

      setCurrentImage(product.img)
    }

    fetchProduct()
  }, [id])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value)
    })

    if (image) {
      formData.append('image', image)
    }

    setLoading(true)

    const res = await fetch(`/api/products?id=${id}`, {
      method: 'PUT',
      body: formData,
    })

    setLoading(false)

    if (!res.ok) {
      alert('Error updating product')
      return
    }

    alert('Product updated')
    router.push('/admin')
  }

  return (
    <div className='min-h-screen bg-slate-950 text-white flex justify-center px-6 py-12'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6'
      >
        <header className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Edit product</h2>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            name='name'
            value={form.name}
            onChange={handleChange}
            className='input'
            required
          />
          <input
            name='reference'
            value={form.reference}
            onChange={handleChange}
            className='input'
            required
          />
          <input
            name='price'
            type='number'
            value={form.price}
            onChange={handleChange}
            className='input'
            required
          />
          <input
            name='stock'
            type='number'
            value={form.stock}
            onChange={handleChange}
            className='input'
            required
          />
          <input
            name='categoryId'
            type='number'
            value={form.categoryId}
            onChange={handleChange}
            className='input'
            required
          />
        </div>

        <textarea
          name='description'
          value={form.description}
          onChange={handleChange}
          rows={4}
          className='input'
          required
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <p className='text-sm text-slate-400'>Current image</p>

            {(preview || currentImage) && (
              <Image
                src={preview || currentImage!}
                alt='Product image'
                width={400}
                height={400}
                className='h-48 w-full rounded-xl object-cover border border-slate-800'
              />
            )}
          </div>

          <label className='flex flex-col gap-2 text-sm text-slate-400'>
            Replace image
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='file'
            />
          </label>
        </div>

        <footer className='flex justify-between pt-4'>
          <button
            type='button'
            onClick={() => router.back()}
            className='text-slate-400 hover:text-blue-500'
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className='px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50'
          >
            {loading ? 'Saving...' : 'Update product'}
          </button>
        </footer>
      </form>
    </div>
  )
}
