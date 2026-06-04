# Agile Operator — Setup Guide

Everything in this folder is pre-configured. Follow these steps once to get the dev environment running.

---

## Prerequisites

- Node.js 18+ (you have v22 — good)
- A [Sanity account](https://sanity.io) (free)
- A [Vercel account](https://vercel.com) (free tier works)

---

## Step 1 — Install dependencies

```bash
cd agile-operator
npm install
```

---

## Step 2 — Create a Sanity API token

The Sanity project already exists (ID: `r51dmz2x`). You just need a read token:

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select the **Agile Operator** project
3. Go to **API → Tokens → Add API token**
4. Name: `Next.js read token` · Permissions: **Viewer**
5. Copy the token

---

## Step 3 — Configure environment variables

`.env.local` is already created with the project ID. Just add your token:

```
SANITY_API_TOKEN=your_token_here
```

HubSpot fields can be filled in later when the contact form is built:
```
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=
NEXT_PUBLIC_HUBSPOT_FORM_ID=
```

---

## Step 4 — Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) — you should see the placeholder homepage.

---

## Step 5 — Run Sanity Studio

In a second terminal:

```bash
npm run sanity
```

Visit [http://localhost:3334](http://localhost:3334) — the Sanity content editor.

First things to do in Studio:
1. Add yourself as an **Author** (name: Jeff Lortz, title: Managing Partner)
2. Create **Categories** (CEO, CMO, CCO, Leadership, Go-to-Market, Planning)
3. Add the 3 **Services** (Growth Advisory, Executive Coaching, Interim/Fractional Executive) with `order` fields 1, 2, 3
4. Fill in **Margins & Mandates** singleton with show URLs
5. Fill in **Collective Edge** singleton with cohort status

---

## Step 6 — Deploy to Vercel

```bash
npx vercel
```

When prompted:
- Link to existing project or create new
- **Framework:** Next.js (auto-detected)
- Add all `.env.local` values as Environment Variables in the Vercel dashboard

For the Sanity Studio to work in production, also run:
```bash
npx sanity cors add https://your-vercel-url.vercel.app
npx sanity cors add https://agile-operator.com
```

---

## Project structure

```
agile-operator/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx        # Root layout (fonts, metadata)
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Tailwind + global styles
│   ├── components/
│   │   ├── layout/           # Nav, Footer
│   │   └── ui/               # Button, Card, etc.
│   └── lib/
│       └── sanity.ts         # Sanity client + image builder
├── sanity/
│   └── schemas/              # All Sanity content types
│       ├── index.ts
│       ├── playbookContent.ts  # Articles + Episodes (unified)
│       ├── author.ts
│       ├── category.ts
│       ├── service.ts
│       ├── marginsAndMandates.ts  # Singleton
│       └── collectiveEdge.ts     # Singleton
├── sanity.config.ts          # Sanity Studio config
├── tailwind.config.ts        # Design tokens (colors, fonts, spacing)
├── next.config.ts            # Redirects, image domains
├── .env.local.example        # Copy to .env.local and fill in
└── SETUP.md                  # This file
```

---

## Design tokens quick reference

Defined in `tailwind.config.ts` — use these throughout:

| Token | Value | Use |
|---|---|---|
| `navy-900` | `#0b1f3a` | Primary brand color, nav, headings |
| `navy-700` | `#163a61` | Hover states |
| `gold-500` | `#d4a017` | Accent — use sparingly |
| `font-display` | DM Serif Display | All headings |
| `font-sans` | Inter | Body, UI |
| `section` | `6rem` | Standard section padding |
| `container-content` | max-w 1200px | Page wrapper |
| `container-prose` | max-w 720px | Article body |

CSS classes ready to use: `.btn-primary`, `.btn-outline`, `.cta-banner`, `.section`, `.container-content`

---

## Next steps after setup

1. Build the **Nav** component (`src/components/layout/Nav.tsx`)
2. Build the **Footer** component (`src/components/layout/Footer.tsx`)
3. Build the **Homepage** sections (hero, services, Collective Edge callout, featured content)
4. See the redesign spec: `../agile-operator-redesign-spec.md`
