'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@heroui/react'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      color="danger"
      variant="flat"
      size="sm"
      onPress={handleLogout}
      isLoading={loading}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}
