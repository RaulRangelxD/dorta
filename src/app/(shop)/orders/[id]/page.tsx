import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { OrderActions } from '@/components/order/OrderActions'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params
  const orderId = Number(id)
  if (isNaN(orderId)) return notFound()

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  })
  if (!order) return notFound()

  const t = await getTranslations('OrderPage')

  return (
    <div className='max-w-3xl mx-auto p-6 text-white'>
      <div className='flex flex-row w-full justify-between'>
        <h1 className='text-2xl font-bold mb-4'>{t('orderDetails')}</h1>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {t('status')}
          <span
            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              order.status === 'pending'
                ? 'bg-yellow-500 text-black'
                : order.status === 'shipped'
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white'
            }`}
          >
            {t(`statusList.${order.status}`)}
          </span>
        </span>
      </div>
      {order.items.map((item) => (
        <div
          key={item.id}
          className='group flex justify-between py-2 border-b border-slate-800 hover:border-blue-500/50 transition-all'
        >
          <div className='relative flex items-center justify-center rounded-2xl overflow-hidden w-32 min-h-32'>
            {item.product.img?.startsWith('http') ? (
              <Image
                src={item.product.img}
                alt={item.product.name}
                fill
                className='object-cover group-hover:scale-105 transition-transform'
              />
            ) : (
              <Package
                size={32}
                className='text-slate-700 group-hover:text-blue-500 transition-colors'
              />
            )}
          </div>
          <div className='flex flex-col w-full px-2'>
            <span>
              {item.product.name}{' '}
              <span className='text-gray-500 dark:text-gray-400 mt-1'>
                × {item.quantity}
              </span>
            </span>
            <span className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      ))}

      <div className='flex flex-wrap justify-between items-center font-semibold text-lg py-2'>
        <span>
          {t('total')}: ${order.total.toFixed(2)}
        </span>

        <OrderActions
          orderId={order.id}
          items={order.items}
          total={order.total}
        />
      </div>
    </div>
  )
}
