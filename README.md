# SHADOW VIPER — Point Blank Clan Website

Website statis untuk profil clan Point Blank. Dibangun dengan **Astro**, **React**, **shadcn/ui**, dan **Tailwind CSS v4**.

## Tech Stack

- **Astro 6** — Static Site Generation, Island Architecture
- **React 19** — Interactive components (islands)
- **shadcn/ui** — UI component library (Card, Badge, Avatar, Dialog, etc.)
- **Tailwind CSS v4** — Utility-first styling with custom military dark theme
- **Motion (Framer Motion)** — Animations (fan-spread, card hover, filter transitions)
- **Lucide React** — Icons

## Getting Started

```bash
npm install
npm run dev        # Dev server at http://localhost:4321
npm run build      # Build to ./dist/
npm run preview    # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.astro     # Sticky nav (static)
│   ├── HeroSection.astro # Hero with clan name
│   ├── HeroCards.tsx    # Fan-spread member cards (React island)
│   ├── StatsBar.astro   # Clan statistics (static)
│   ├── MemberGrid.tsx   # Member grid + filter + search (React island)
│   ├── MemberCard.tsx   # Individual member card
│   ├── MemberDialog.tsx # Member detail popup
│   └── Footer.astro     # Footer (static)
├── data/
│   ├── clan.ts          # Clan info (name, motto, stats, socials)
│   └── members.ts       # All member data + types
├── layouts/
│   └── MainLayout.astro # Base layout (head, fonts, global styles)
├── lib/
│   └── utils.ts         # cn() helper
├── pages/
│   └── index.astro      # Single page
└── styles/
    └── globals.css      # Tailwind + theme + background effects
```

## Edit Member Data

All member data is in `src/data/members.ts`. Each member has:

| Field        | Type    | Description                     |
| ------------ | ------- | ------------------------------- |
| `nickname`   | string  | In-game name                    |
| `name`       | string  | Real name                       |
| `rank`       | enum    | Private → General               |
| `city`       | string  | City                            |
| `role`       | enum    | sniper, rusher, support, medic  |
| `status`     | enum    | online / offline                |
| `joinDate`   | string  | e.g. "Jan 2024"                 |
| `kdRatio`    | number  | Kill/Death ratio                |
| `isFeatured` | boolean | Show in hero fan-spread (max 5) |
| `isLeader`   | boolean | Clan leader badge               |
| `bio`        | string? | Optional bio text               |

## Edit Clan Info

Edit `src/data/clan.ts` to change clan name, motto, stats, and social links.

## Deploy

```bash
npm run build
# Deploy ./dist/ to Vercel, Netlify, or any static host
```
