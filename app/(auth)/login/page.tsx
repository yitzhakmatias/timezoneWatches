'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Heading, Input, Text, VStack, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Login failed')
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('Network error — is the API server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="#0f0f13" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box w="full" maxW="400px">
        <Box textAlign="center" mb={8}>
          <Heading size="2xl" color="white" fontWeight="bold" letterSpacing="tight" mb={2}>
            Timezone Watches
          </Heading>
          <Text color="whiteAlpha.500" fontSize="sm">Sign in to view your clocks</Text>
        </Box>

        <Box
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="2xl"
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <VStack gap={4}>
              <Box w="full">
                <Text color="whiteAlpha.600" fontSize="xs" mb={1} textTransform="uppercase" letterSpacing="wider">
                  Email
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  bg="gray.900"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  color="white"
                  borderRadius="xl"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                  _focus={{ borderColor: 'blue.400', outline: 'none' }}
                  placeholder="you@example.com"
                  _placeholder={{ color: 'whiteAlpha.300' }}
                />
              </Box>

              <Box w="full">
                <Text color="whiteAlpha.600" fontSize="xs" mb={1} textTransform="uppercase" letterSpacing="wider">
                  Password
                </Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  bg="gray.900"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  color="white"
                  borderRadius="xl"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                  _focus={{ borderColor: 'blue.400', outline: 'none' }}
                  placeholder="••••••"
                  _placeholder={{ color: 'whiteAlpha.300' }}
                />
              </Box>

              {error && (
                <Box
                  w="full"
                  bg="red.900"
                  border="1px solid"
                  borderColor="red.600"
                  borderRadius="lg"
                  px={4}
                  py={2}
                >
                  <Text color="red.300" fontSize="sm">{error}</Text>
                </Box>
              )}

              <Button
                type="submit"
                w="full"
                bg="blue.600"
                color="white"
                borderRadius="xl"
                fontWeight="semibold"
                loading={loading}
                loadingText="Signing in…"
                _hover={{ bg: 'blue.500' }}
                mt={2}
              >
                Sign in
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center" color="whiteAlpha.400" fontSize="sm" mt={6}>
          No account?{' '}
          <Link as={NextLink} href="/register" color="blue.400" _hover={{ color: 'blue.300' }}>
            Create one
          </Link>
        </Text>
      </Box>
    </Box>
  )
}
