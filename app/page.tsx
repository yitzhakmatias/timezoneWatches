import { Box, Heading, Text } from '@chakra-ui/react'
import TimezoneGrid from '@/components/TimezoneGrid'

export default function Home() {
  return (
    <Box minH="100vh" px={{ base: 4, md: 8 }} py={12} bg="#0f0f13">
      <Box textAlign="center" mb={12}>
        <Heading
          as="h1"
          size="4xl"
          fontWeight="bold"
          letterSpacing="tight"
          color="white"
          mb={2}
        >
          Timezone Watches
        </Heading>
        <Text color="whiteAlpha.500" fontSize="sm">
          Your local time vs. all US timezones — live
        </Text>
      </Box>

      <TimezoneGrid />
    </Box>
  )
}
