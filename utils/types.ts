export interface Product{
  _id: string
  name: string
  description: string
  price: number | string
  reference: string
  categoryId: string
  stock: number
  category: string
  img?: string
  createdAt: string
  updatedAt: string
}
