export interface Product {
  id: number

  name: string
  description: string
  price: number
  reference: string

  stock: number

  img?: string | null

  categoryId: number
  category: {
    id: number
    name: string
    department: string
    description: string
    image: string
  }

  createdAt: string
  updatedAt: string
}
