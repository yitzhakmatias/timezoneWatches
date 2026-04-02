'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Text, Button } from '@chakra-ui/react'

interface UserProfile {
  id: number
  email: string
  name: string
}

export default function UserHeader() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setUser(data) })
      .catch(() => {})
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  if (!user) return null

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      gap={3}
      px={{ base: 4, md: 8 }}
      py={3}
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Text fontSize="sm" color="whiteAlpha.600">
        Signed in as{' '}
        <Text as="span" color="whiteAlpha.900" fontWeight="semibold">
          {user.name}
        </Text>
      </Text>
      <Button
        size="xs"
        variant="outline"
        borderColor="whiteAlpha.200"
        color="whiteAlpha.500"
        borderRadius="lg"
        _hover={{ borderColor: 'whiteAlpha.400', color: 'whiteAlpha.800' }}
        onClick={handleLogout}
      >
        Sign out
      </Button>
    </Box>
  )
}
