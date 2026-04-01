# Product Requirements Document — Timezone Watches

**Version:** 1.0  
**Date:** 2026-04-01  
**Status:** Active

---

## Overview

Timezone Watches is a real-time analog clock dashboard that displays all six US timezones simultaneously. Users can select any reference timezone (auto-detected from their browser) and instantly see time offsets relative to every US zone.

---

## Problem Statement

Distributed teams, travelers, and remote workers frequently need to compare their local time against multiple US timezones at once. Existing tools either show only digital clocks, require manual timezone math, or lack a quick visual comparison across all US zones.

---

## Goals

- Display all six US timezones as live analog watches in a single view.
- Auto-detect the user's local timezone and use it as the reference point.
- Show hour offsets between the selected reference timezone and each US zone.
- Keep the interface dark, minimal, and readable at a glance.

---

## Non-Goals

- International timezone support beyond the six US zones (out of scope for v1).
- User accounts, saved preferences, or server-side persistence.
- Mobile native apps (web only).

---

## Users

**Primary:** Remote workers, developers, and distributed team members who need to schedule meetings or coordinate across US time zones.  
**Secondary:** Travelers and anyone who needs a quick timezone reference.

---

## Features

### F1 — Live Analog Watches
Each timezone is displayed as an SVG analog watch with:
- Hour, minute, and second hands that update every second.
- 60-tick bezel with accented hour ticks.
- Hour numerals on the dial face.
- A wristwatch aesthetic (strap, crown, case ring).

### F2 — Digital + Date Readout
Below each watch face:
- Digital time in 12-hour format (`hh:mm:ss AM/PM`).
- Short date (`Mon, Apr 1`).
- Timezone label and IANA identifier.

### F3 — Timezone Selector
A dropdown above the grid lets the user set the reference timezone. Options include:
- The user's browser-detected timezone (listed first if outside the six US zones).
- All six US zones.

The selected timezone drives offset labels across all watches.

### F4 — Offset Badges
Each watch card shows a colored badge (`+Nh` / `-Nh`) indicating how many hours ahead or behind that zone is relative to the selected reference. Green = ahead, red = behind.

### F5 — Local Highlight
The watch matching the selected reference timezone is visually distinguished:
- Blue accent color and outline.
- Drop shadow glow.
- "Local" badge on the abbreviation row.

### F6 — Non-US Reference Watch
When the selected timezone is outside the six US zones, a standalone "Reference Timezone" watch is rendered above the grid with a visual separator.

### F7 — Responsive Grid
The watch grid adapts to screen width:
- 2 columns on mobile.
- 3 columns on medium screens.
- 6 columns (all zones in one row) on wide screens.

---

## US Timezones Covered

| Label         | IANA Identifier        | Abbreviation | Accent Color |
|---------------|------------------------|--------------|--------------|
| Eastern Time  | America/New_York       | ET           | Blue         |
| Central Time  | America/Chicago        | CT           | Purple       |
| Mountain Time | America/Denver         | MT           | Green        |
| Pacific Time  | America/Los_Angeles    | PT           | Orange       |
| Alaska Time   | America/Anchorage      | AKT          | Sky Blue     |
| Hawaii Time   | Pacific/Honolulu       | HT           | Pink         |

---

## Technical Requirements

| Requirement | Detail |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| UI | Chakra UI v3 |
| Theming | Forced dark mode via `next-themes` |
| Clock updates | `setInterval` every 1000 ms |
| Time parsing | `Intl.DateTimeFormat.formatToParts` |
| Offset calculation | `Intl.DateTimeFormat` with `timeZoneName: 'shortOffset'` |
| SSR safety | Watch state initializes as `null`; time logic runs only client-side via `useEffect` |
| Hydration | All SVG coordinates rounded to 3 decimal places to prevent float mismatches |

---

## Design Constraints

- Dark background (`#0f0f13`) throughout; no light mode.
- Each timezone uses a distinct accent color for its second hand, center cap, and tick marks.
- Watch cards use `w="fit-content"` so grid column gaps remain visible.
- Plain `<svg>` elements (not `Box as="svg"`) to support SVG-specific props like `viewBox`.

---

## Success Metrics

- All six US clocks render and tick in sync without hydration errors.
- Offset labels update immediately when the user changes the reference timezone.
- Page loads and renders correctly on Windows Node.js (where `America/Honolulu` is unsupported — `Pacific/Honolulu` must be used instead).
- No layout shift between SSR and client hydration.

---

## Out of Scope (Future Considerations)

- World clock mode with arbitrary timezone search.
- Alarm or reminder functionality.
- Shareable links with a pre-selected reference timezone.
- Internationalized time formats (non-US locale display).
