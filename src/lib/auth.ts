import { useRouter } from 'next/navigation'

export async function logout(router: ReturnType<typeof useRouter>) {
  try {
    const cartId = localStorage.getItem('cartId')
    if (cartId) {
      await fetch('/api/cart/disassociate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: Number(cartId) }),
      })
    }

    await fetch('/api/logout', { method: 'POST' })

    router.push('/logout')
  } catch (error) {
    console.error('Logout failed', error)
  }
}
