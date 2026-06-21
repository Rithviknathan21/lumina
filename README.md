# LUMINA — Experience Space Like Never Before

<div align="center">
  <img src="public/og-image.png" alt="LUMINA" width="100%" />

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://typescriptlang.org)
  [![Three.js](https://img.shields.io/badge/Three.js-r168-black?logo=three.js)](https://threejs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
  [![Supabase](https://img.shields.io/badge/Supabase-ready-3ECF8E?logo=supabase)](https://supabase.com)

  An immersive cinematic space exploration experience. Award-winning visual design with real-time 3D rendering, GPU-accelerated animations, and a premium futuristic HUD aesthetic.
</div>

---

## Architecture

```
lumina/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   ├── page.tsx            # Landing page
│   ├── providers.tsx       # Client providers (GSAP, Lenis, Toast, Auth)
│   ├── experience/         # Immersive 3D experience route
│   │   ├── layout.tsx      # Fixed viewport layout
│   │   └── page.tsx        # Main experience page
│   ├── not-found.tsx       # Space-themed 404
│   └── api/health/         # Health check endpoint
│
├── components/
│   ├── three/              # React Three Fiber components
│   │   ├── SceneCanvas     # R3F canvas with postprocessing
│   │   ├── StarField       # GPU particle star field
│   │   ├── NebulaCloud     # Volumetric nebula sprites
│   │   ├── CameraRig       # Cinematic camera w/ parallax
│   │   ├── AsteroidBelt    # GPU-instanced asteroid field
│   │   └── SpaceDebris     # Floating micro-particles
│   │
│   ├── layout/             # Page-level layout components
│   │   ├── Navigation      # Navbar with mobile overlay
│   │   ├── Footer          # Site footer
│   │   ├── HeroSection     # Landing hero
│   │   └── ExperienceHUD   # In-experience heads-up display
│   │
│   ├── loading/            # Loading screen system
│   │   └── LoadingScreen   # Phase-based cinematic loader
│   │
│   ├── auth/               # Auth modal shell (logic pending)
│   │   ├── AuthModal       # Modal UI w/ glass styling
│   │   └── AuthContext     # useAuth() hook + provider
│   │
│   ├── shared/             # Reusable UI primitives
│   │   ├── GlassPanel      # Glassmorphism panel (4 variants)
│   │   ├── HUDLabel        # Mono HUD text components
│   │   └── LuminaButton    # 5-variant CTA button
│   │
│   └── ui/                 # Shadcn UI (LUMINA-themed)
│       ├── button, badge, input, select
│       ├── dialog, tooltip, toast
│       ├── progress, slider, switch
│       ├── tabs, scroll-area, separator
│       └── index.ts        # Barrel export
│
├── hooks/                  # Custom React hooks
│   ├── use-audio           # Web Audio API manager
│   ├── use-gsap            # GSAP context + reveal utilities
│   ├── use-keyboard        # Global shortcut bindings
│   ├── use-lenis           # Smooth scroll singleton
│   ├── use-loading         # Phase-based loading state machine
│   ├── use-local-storage   # Type-safe localStorage hook
│   ├── use-mouse           # Raw + normalized mouse position
│   ├── use-intersection-observer # Scroll reveal trigger
│   ├── use-performance     # FPS monitoring + auto quality
│   └── use-window-size     # Debounced resize observer
│
├── animations/
│   ├── gsap.ts             # GSAP utilities + custom eases
│   └── framer-variants.ts  # Framer Motion variant presets
│
├── lib/
│   ├── supabase.ts         # Supabase client (PKCE auth)
│   ├── constants.ts        # App-wide constants + config
│   └── utils.ts            # Math, type, DOM utilities
│
├── styles/
│   └── globals.css         # Tailwind + CSS custom properties
│
├── types/
│   ├── index.ts            # Shared TypeScript types
│   └── database.ts         # Supabase generated types
│
└── supabase/
    └── migrations/         # SQL migration files
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15 | App Router, SSR, API Routes |
| **TypeScript** | 5.x | Type safety |
| **React Three Fiber** | 8.x | Three.js in React |
| **Three.js** | r168 | 3D rendering engine |
| **@react-three/drei** | latest | R3F helpers |
| **@react-three/postprocessing** | latest | Bloom, vignette, etc. |
| **GSAP** | 3.x | Timeline animations |
| **Framer Motion** | 11.x | React animations |
| **Lenis** | latest | Smooth scroll |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Shadcn UI** | latest | Headless component primitives |
| **Supabase** | latest | Auth + database |
| **Lucide React** | latest | Icon system |

---

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `lumina-void` | `#020408` | Deep space background |
| `lumina-deep` | `#060C14` | Card backgrounds |
| `lumina-cosmos` | `#0D1B2E` | Section backgrounds |
| `lumina-star` | `#A8C8FF` | Primary accent (blue-white) |
| `lumina-violet` | `#7B5EA7` | Secondary accent (nebula) |
| `lumina-solar` | `#F5A623` | Highlight accent (gold) |

### Typography

| Font | Usage |
|---|---|
| **Syne** | Display headings (`font-display`) |
| **Inter** | Body text (`font-sans`) |
| **JetBrains Mono** | HUD / mono labels (`font-mono`) |

### Component Variants

**GlassPanel**: `default` · `light` · `heavy` · `bordered`  
**LuminaButton**: `primary` · `secondary` · `ghost` · `solar` · `destructive`  
**Badge**: `default` · `secondary` · `violet` · `solar` · `live` · `outline`

---

## Graphics Quality Presets

```ts
// lib/constants.ts
QUALITY_PRESETS = {
  low:    { pixelRatio: 0.75, starCount: 2000,  bloomStrength: 0.4, antialias: false },
  medium: { pixelRatio: 1.0,  starCount: 4000,  bloomStrength: 0.6, antialias: false },
  high:   { pixelRatio: 1.5,  starCount: 8000,  bloomStrength: 0.8, antialias: true  },
  ultra:  { pixelRatio: 2.0,  starCount: 15000, bloomStrength: 1.0, antialias: true  },
}
```

`use-performance` automatically detects FPS and downgrades quality presets to maintain smoothness.

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+ (or npm/yarn)
- Supabase project

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/lumina.git
cd lumina

# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local
```

### Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LUMINA
```

### Database Setup

```bash
# Run Supabase migrations
npx supabase db push

# Or link to remote project
npx supabase link --project-ref your-project-ref
npx supabase db push
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
pnpm build
pnpm start
```

---

## Performance

- **GPU particles** — StarField and NebulaCloud use custom GLSL shaders with additive blending
- **Auto quality scaling** — `use-performance` monitors FPS and auto-adjusts quality preset
- **Dynamic imports** — SceneCanvas loaded with `next/dynamic` (no SSR)
- **Code splitting** — Each route lazily loads its 3D components
- **Adaptive DPR** — `<AdaptiveDpr>` from drei reduces pixel ratio under load
- **Instanced meshes** — AsteroidBelt uses `THREE.InstancedMesh` for thousands of objects at ~0 CPU cost

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Escape` | Close modals |
| `F` | Toggle FPS meter |
| `Q` | Cycle quality preset |
| `M` | Toggle audio mute |

---

## Adding Authentication

The auth modal shell is in `components/auth/AuthModal.tsx`. To implement:

1. Install Supabase Auth helpers: `pnpm add @supabase/ssr`
2. Add sign-in/sign-up handlers in `AuthFormSlot`
3. Call `supabase.auth.signInWithPassword()` / `signUp()` from `lib/supabase.ts`
4. Add session listener in `app/providers.tsx`
5. Protect routes with middleware in `middleware.ts`

---

## License

© 2025 LUMINA. All rights reserved.

---

<div align="center">
  <strong>Experience Space Like Never Before.</strong>
</div>
