# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (defaults to port 3000)
npm run build     # Production build — always run before committing to verify no type errors
npm run start     # Serve production build
npm run lint      # ESLint
```

To free a port before starting:
```bash
npx kill-port 3000
```

## Architecture

**Stack:** Next.js 15 App Router · TypeScript · Chakra UI v3 · `next-themes` (dark mode)

### Key files

- `app/page.tsx` — Server component. Defines `US_TIMEZONES` array and `LOCAL_TZ` constant. Computes offset labels via `Intl.DateTimeFormat` with `timeZoneName: 'shortOffset'`. Renders a `SimpleGrid` of `Watch` components.
- `components/Watch.tsx` — Client component (`'use client'`). All clock logic lives here: `parseTime()` uses `Intl.DateTimeFormat.formatToParts` to extract h/m/s, then renders an inline SVG analog watch face. State initializes as `null` (SSR-safe) and populates in `useEffect` every second.
- `components/ui/provider.tsx` — Wraps `ChakraProvider` (with `defaultSystem`) and `ColorModeProvider` with `forcedTheme="dark"`.
- `components/ui/color-mode.tsx` — Thin wrapper around `next-themes` `ThemeProvider`.

### Timezone handling

- `LOCAL_TZ` in `page.tsx` is hardcoded to `'America/New_York'` (GMT-4 / EDT). Change this constant to update the local reference timezone.
- Use `Pacific/Honolulu` (not `America/Honolulu`) — the `America/` alias is not recognized by Windows Node.js.
- Offset calculation uses `Intl.DateTimeFormat` with `timeZoneName: 'shortOffset'` and regex-parses the `GMT±N` string. Do **not** use `new Date(date.toLocaleString(...))` for offset math — it fails in Windows Node.js.

### SSR / hydration rules

- `Watch` state must initialize as `null`, never call `parseTime()` in `useState` initializer — it runs during SSR and can throw on unsupported timezones.
- All `Math.cos`/`Math.sin` SVG coordinates must go through `rnd()` (rounds to 3 decimal places) to prevent server/client float precision mismatches that cause hydration errors.
- `app/page.tsx` has no `'use client'` — it is a server component. All interactive/time logic stays in `Watch.tsx`.

### Chakra UI v3 notes

- Use `Box as="svg"` will **not** pass SVG-specific props like `viewBox`. Use a plain `<svg>` wrapped in a `<Box>` for filter effects.
- Cards use `w="fit-content"` so `SimpleGrid` column gaps are visible — without this, cards stretch to fill columns and gaps disappear.
- Dark mode is forced globally via `<ColorModeProvider forcedTheme="dark">`, not per-component.

## Git

- `master` — stable branch  
- `develop` — active development branch  
- Remote: `https://github.com/yitzhakmatias/timezoneWatches`
