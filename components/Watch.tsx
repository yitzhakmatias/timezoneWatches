'use client'

import { useEffect, useState } from 'react'
import { Box, Text, Badge, VStack } from '@chakra-ui/react'

type WatchProps = {
  timezone: string
  label: string
  abbreviation: string
  accent: string
  isLocal?: boolean
  offsetLabel?: string
}

type ParsedTime = {
  hours: number
  minutes: number
  seconds: number
  digital: string
  date: string
}

function parseTime(timezone: string): ParsedTime {
  const now = new Date()

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(now)

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10)

  const digital = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(now)

  const date = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(now)

  return {
    hours: get('hour') % 12,
    minutes: get('minute'),
    seconds: get('second'),
    digital,
    date,
  }
}

const MINUTE_TICKS = Array.from({ length: 60 }, (_, i) => i)
const HOUR_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const CX = 100
const CY = 100
const R = 85

const rnd = (n: number) => Math.round(n * 1000) / 1000

function toRad(deg: number) {
  return (deg - 90) * (Math.PI / 180)
}

function handTip(angleDeg: number, length: number) {
  const rad = toRad(angleDeg)
  return { x: rnd(CX + length * Math.cos(rad)), y: rnd(CY + length * Math.sin(rad)) }
}

export default function Watch({
  timezone,
  label,
  abbreviation,
  accent,
  isLocal,
  offsetLabel,
}: WatchProps) {
  const [time, setTime] = useState<ParsedTime | null>(null)

  useEffect(() => {
    const updateTime = () => setTime(parseTime(timezone))
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [timezone])

  const t = time ?? { hours: 0, minutes: 0, seconds: 0, digital: '--:--:-- --', date: '' }

  const hourDeg = (t.hours / 12) * 360 + (t.minutes / 60) * 30
  const minuteDeg = (t.minutes / 60) * 360 + (t.seconds / 60) * 6
  const secondDeg = (t.seconds / 60) * 360

  const hourTip = handTip(hourDeg, 46)
  const minuteTip = handTip(minuteDeg, 62)
  const secondTip = handTip(secondDeg, 68)
  const secondTail = handTip(secondDeg + 180, 14)

  return (
    <VStack
      gap={3}
      p={5}
      borderRadius="2xl"
      bg={isLocal ? 'blue.950' : 'gray.900'}
      outline={isLocal ? '2px solid' : '1px solid'}
      outlineColor={isLocal ? 'blue.400' : 'whiteAlpha.100'}
      align="center"
      w="fit-content"
      transition="all 0.2s"
      _hover={{ outlineColor: isLocal ? 'blue.300' : 'whiteAlpha.300' }}
    >
      {/* Zone badge row */}
      <Box display="flex" alignItems="center" gap={2}>
        {isLocal && (
          <Badge colorPalette="blue" variant="subtle" size="sm" textTransform="uppercase" letterSpacing="wider">
            Local
          </Badge>
        )}
        <Text
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="widest"
          textTransform="uppercase"
          color={accent}
        >
          {abbreviation}
        </Text>
      </Box>

      {/* Watch SVG */}
      <Box
        style={{
          filter: isLocal
            ? 'drop-shadow(0 6px 24px rgba(99,179,237,0.3))'
            : 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))',
        }}
      >
      <svg viewBox="0 0 200 200" width="190" height="190">
        {/* Strap */}
        <rect x="80" y="4" width="40" height="16" rx="5" fill="#18181f" />
        <rect x="80" y="180" width="40" height="16" rx="5" fill="#18181f" />

        {/* Case */}
        <circle cx={CX} cy={CY} r={R + 8} fill="#18181f" />
        <circle cx={CX} cy={CY} r={R + 6} fill="none" stroke={accent} strokeWidth="1" opacity="0.5" />

        {/* Crown */}
        <rect x="189" y="95" width="7" height="10" rx="2.5" fill="#222230" stroke={accent} strokeWidth="0.7" opacity="0.6" />

        {/* Dial */}
        <circle cx={CX} cy={CY} r={R} fill="#0d0d14" />

        {/* Ticks */}
        {MINUTE_TICKS.map((i) => {
          const deg = (i / 60) * 360 - 90
          const rad = deg * (Math.PI / 180)
          const isHour = i % 5 === 0
          const outer = R
          const inner = isHour ? R - 10 : R - 5
          return (
            <line
              key={i}
              x1={rnd(CX + outer * Math.cos(rad))}
              y1={rnd(CY + outer * Math.sin(rad))}
              x2={rnd(CX + inner * Math.cos(rad))}
              y2={rnd(CY + inner * Math.sin(rad))}
              stroke={isHour ? accent : '#ffffff28'}
              strokeWidth={isHour ? 2 : 0.8}
            />
          )
        })}

        {/* Hour numbers */}
        {HOUR_NUMBERS.map((n) => {
          const deg = (n / 12) * 360 - 90
          const rad = deg * (Math.PI / 180)
          const nr = R - 20
          return (
            <text
              key={n}
              x={rnd(CX + nr * Math.cos(rad))}
              y={rnd(CY + nr * Math.sin(rad))}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9.5"
              fontWeight="600"
              fill="#ffffff80"
              fontFamily="system-ui"
            >
              {n}
            </text>
          )
        })}

        {/* Hour hand */}
        <line x1={CX} y1={CY} x2={hourTip.x} y2={hourTip.y} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

        {/* Minute hand */}
        <line x1={CX} y1={CY} x2={minuteTip.x} y2={minuteTip.y} stroke="#dddde8" strokeWidth="3" strokeLinecap="round" />

        {/* Second hand */}
        <line x1={secondTail.x} y1={secondTail.y} x2={secondTip.x} y2={secondTip.y} stroke={accent} strokeWidth="1.5" strokeLinecap="round" />

        {/* Center cap */}
        <circle cx={CX} cy={CY} r="5" fill={accent} />
        <circle cx={CX} cy={CY} r="2.5" fill="#0d0d14" />
      </svg>
      </Box>

      {/* Digital readout */}
      <Text fontFamily="mono" fontSize="lg" fontWeight="bold" letterSpacing="wider" color={accent}>
        {t.digital}
      </Text>

      {/* Date */}
      <Text fontSize="xs" color="whiteAlpha.500">{t.date}</Text>

      {/* Label */}
      <VStack gap={0} align="center">
        <Text fontSize="sm" fontWeight="semibold" color="whiteAlpha.800">{label}</Text>
        <Text fontSize="2xs" color="whiteAlpha.400">{timezone}</Text>
      </VStack>

      {/* Offset badge */}
      {offsetLabel && (
        <Badge
          colorPalette={offsetLabel.startsWith('+') ? 'green' : 'red'}
          variant="subtle"
          fontFamily="mono"
          fontWeight="bold"
        >
          {offsetLabel} from you
        </Badge>
      )}
    </VStack>
  )
}
