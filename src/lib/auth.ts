import { useRouter } from 'next/navigation'

export async function logout(router: ReturnType<typeof useRouter>) {
  try {
    await fetch('/api/logout', {
      method: 'POST',
    })

    router.push('/logout')
  } catch (error) {
    console.error('Logout failed', error)
  }
}
