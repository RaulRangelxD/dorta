'use client'

import Image from 'next/image'
import { useState, ChangeEvent, FormEvent } from 'react'

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
  const [loading, setLoading] = useState(false)

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
    <form
      onSubmit={handleSubmit}
      className='max-w-lg space-y-4 rounded border p-4'
    >
      <h2 className='text-xl font-semibold'>Create product</h2>

      <input
        name='name'
        placeholder='Name'
        value={form.name}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <textarea
        name='description'
        placeholder='Description'
        value={form.description}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        name='price'
        type='number'
        step='0.01'
        placeholder='Price'
        value={form.price}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        name='reference'
        placeholder='Reference'
        value={form.reference}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        name='stock'
        type='number'
        placeholder='Stock'
        value={form.stock}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        name='categoryId'
        type='number'
        placeholder='Category ID'
        value={form.categoryId}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        type='file'
        accept='image/*'
        onChange={handleImageChange}
        required
      />

      {preview && (
        <Image
          src={preview}
          alt='Preview'
          width={192}
          height={192}
          className='h-48 w-full rounded object-cover'
        />
      )}

      <button
        disabled={loading}
        className='w-full rounded bg-black py-2 text-white disabled:opacity-50'
      >
        {loading ? 'Uploading...' : 'Create product'}
      </button>
    </form>
  )
}
