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
    router.push('/admin/products')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-lg space-y-4 rounded border p-4'
    >
      <h2 className='text-xl font-semibold'>Edit product</h2>

      <input
        name='name'
        value={form.name}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <textarea
        name='description'
        value={form.description}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        name='price'
        type='number'
        step='0.01'
        value={form.price}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        name='reference'
        value={form.reference}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        name='stock'
        type='number'
        value={form.stock}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      <input
        name='categoryId'
        type='number'
        value={form.categoryId}
        onChange={handleChange}
        required
        className='w-full rounded border p-2'
      />

      {currentImage && !preview && (
        <Image
          src={currentImage}
          alt='Current image'
          width={192}
          height={192}
          className='h-48 w-full rounded object-cover'
        />
      )}

      {preview && (
        <Image
          src={preview}
          alt='Preview'
          width={192}
          height={192}
          className='h-48 w-full rounded object-cover'
        />
      )}

      <input type='file' accept='image/*' onChange={handleImageChange} />

      <button
        disabled={loading}
        className='w-full rounded bg-black py-2 text-white disabled:opacity-50'
      >
        {loading ? 'Saving...' : 'Update product'}
      </button>
    </form>
  )
}
