import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Banknote } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params
  const orderId = Number(id)

  if (isNaN(orderId)) return notFound()

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) return notFound()

  const message = `
Hello, I would like to confirm Order #${order.id}

${order.items
  .map(
    (item) =>
      `- ${item.product.name} (${item.quantity}) - $${(
        item.price * item.quantity
      ).toFixed(2)}`,
  )
  .join('\n')}

Total: $${order.total.toFixed(2)}
`

  const whatsappNumber = '+584160751024'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message,
  )}`

  return (
    <div className='max-w-2xl mx-auto p-6 text-white'>
      <h1 className='text-2xl font-bold mb-4'>Order #{order.id}</h1>

      {order.items.map((item) => (
        <div
          key={item.id}
          className='flex justify-between border-b border-slate-700 pb-2'
        >
          <span>
            {item.product.name} × {item.quantity}
          </span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className='flex justify-between mt-6 font-semibold text-lg'>
        <span>Total:</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <Link
        href={whatsappUrl}
        target='_blank'
        className='mt-6 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition'
      >
        <Banknote size={18} />
        Confirm via WhatsApp
      </Link>
    </div>
  )
}
