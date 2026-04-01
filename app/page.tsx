import { Box, SimpleGrid, Heading, Text, Separator } from '@chakra-ui/react'
import Watch from '@/components/Watch'

const US_TIMEZONES = [
  { timezone: 'America/New_York',    label: 'Eastern Time',  abbreviation: 'ET',  accent: '#60a5fa' },
  { timezone: 'America/Chicago',     label: 'Central Time',  abbreviation: 'CT',  accent: '#a78bfa' },
  { timezone: 'America/Denver',      label: 'Mountain Time', abbreviation: 'MT',  accent: '#34d399' },
  { timezone: 'America/Los_Angeles', label: 'Pacific Time',  abbreviation: 'PT',  accent: '#fb923c' },
  { timezone: 'America/Anchorage',   label: 'Alaska Time',   abbreviation: 'AKT', accent: '#38bdf8' },
  { timezone: 'Pacific/Honolulu',    label: 'Hawaii Time',   abbreviation: 'HT',  accent: '#f472b6' },
]

// Your local timezone — GMT-4 = Eastern Daylight Time
const LOCAL_TZ = 'America/New_York'

function getUTCOffsetHours(tz: string): number {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZoneName: 'shortOffset',
  }).formatToParts(now)
  const name = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+0'
  const match = name.match(/GMT([+-])(\d+)(?::(\d+))?/)
  if (!match) return 0
  const sign = match[1] === '+' ? 1 : -1
  return sign * (parseInt(match[2], 10) + parseInt(match[3] ?? '0', 10) / 60)
}

function getOffsetLabel(localTz: string, targetTz: string): string | undefined {
  if (localTz === targetTz) return undefined
  const diff = Math.round(getUTCOffsetHours(targetTz) - getUTCOffsetHours(localTz))
  return diff >= 0 ? `+${diff}h` : `${diff}h`
}

export default function Home() {
  const localCity = LOCAL_TZ.split('/').pop()?.replace(/_/g, ' ') ?? LOCAL_TZ
  const isLocalUS = US_TIMEZONES.some((z) => z.timezone === LOCAL_TZ)

  return (
    <Box minH="100vh" px={{ base: 4, md: 8 }} py={12} bg="#0f0f13">
      {/* Header */}
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

      {/* Local watch (only if not already in US list) */}
      {!isLocalUS && (
        <>
          <Box display="flex" flexDir="column" alignItems="center" mb={12}>
            <Text
              mb={3}
              fontSize="xs"
              color="whiteAlpha.400"
              textTransform="uppercase"
              letterSpacing="widest"
              fontWeight="semibold"
            >
              Your Timezone
            </Text>
            <Watch
              timezone={LOCAL_TZ}
              label={`Your Time · ${localCity}`}
              abbreviation="LOCAL"
              accent="#63b3ed"
              isLocal
            />
          </Box>

          <Box display="flex" alignItems="center" gap={4} mb={10} maxW="5xl" mx="auto">
            <Separator flex="1" borderColor="whiteAlpha.100" />
            <Text fontSize="xs" color="whiteAlpha.300" textTransform="uppercase" letterSpacing="widest" fontWeight="semibold">
              United States
            </Text>
            <Separator flex="1" borderColor="whiteAlpha.100" />
          </Box>
        </>
      )}

      {/* US timezone grid */}
      <SimpleGrid
        columns={{ base: 2, md: 3, xl: 6 }}
        rowGap={6}
        columnGap={{ base: 4, xl: 6 }}
        maxW="7xl"
        mx="auto"
        justifyItems="center"
      >
        {US_TIMEZONES.map((zone) => (
          <Watch
            key={zone.timezone}
            timezone={zone.timezone}
            label={zone.label}
            abbreviation={zone.abbreviation}
            accent={zone.accent}
            isLocal={zone.timezone === LOCAL_TZ}
            offsetLabel={getOffsetLabel(LOCAL_TZ, zone.timezone)}
          />
        ))}
      </SimpleGrid>

      <Text textAlign="center" color="whiteAlpha.200" fontSize="xs" mt={12}>
        Local timezone: {LOCAL_TZ}
      </Text>
    </Box>
  )
}
