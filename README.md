# Timezone Watches

A Next.js application that displays live analog watch faces for all US timezones, compared against your local time.

## Features

- **Live analog clocks** — SVG watch faces with ticking hour, minute, and second hands
- **6 US timezones** — Eastern, Central, Mountain, Pacific, Alaska, Hawaii
- **Offset badges** — shows how many hours ahead or behind each timezone is from your local time
- **Digital readout** — 12-hour format displayed below each watch
- **Dark theme** — forced dark mode via Chakra UI + next-themes
- **Responsive grid** — 2 columns on mobile, 3 on tablet, 6 on desktop

## Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI v3](https://www.chakra-ui.com/)
- `Intl.DateTimeFormat` — native timezone handling, no external date libraries

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

To change the local reference timezone, update `LOCAL_TZ` in `app/page.tsx`:

```ts
const LOCAL_TZ = 'America/New_York' // GMT-4 (EDT)
```

Use a valid IANA timezone identifier. On Windows, prefer canonical names (e.g. `Pacific/Honolulu` instead of `America/Honolulu`).

## Project Structure

```
app/
  page.tsx          # Server component — timezone grid layout
  layout.tsx        # Root layout with Chakra provider
components/
  Watch.tsx         # Analog clock component (client)
  ui/
    provider.tsx    # Chakra + dark mode provider
    color-mode.tsx  # next-themes wrapper
```

## Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
npm run lint    # ESLint
```
