# LUMINA — Architecture Deep Dive

## Rendering Pipeline

```
Browser
  └── Next.js 15 App Router
        ├── Server Components (layout, metadata, static content)
        └── Client Boundary
              ├── Lenis (smooth scroll)
              ├── GSAP (timeline animations)
              ├── Framer Motion (React transitions)
              └── React Three Fiber (dynamic import — no SSR)
                    └── Three.js WebGL Context
                          ├── Renderer (ACESFilmic tone mapping)
                          ├── Scene Graph
                          │     ├── StarField (GPU particles)
                          │     ├── NebulaCloud (sprite system)
                          │     ├── AsteroidBelt (instanced mesh)
                          │     ├── SpaceDebris (point cloud)
                          │     └── Lights (ambient + directional)
                          └── Postprocessing
                                ├── Bloom (UnrealBloomPass)
                                ├── Vignette
                                └── ChromaticAberration
```

## State Architecture

LUMINA uses a flat, hook-based state architecture (no global store like Redux/Zustand — by design, to minimize re-renders in the 3D context).

```
App State
  ├── Performance Quality    use-performance (localStorage-persisted)
  ├── Loading Phase          use-loading (phase state machine)
  ├── Audio State            use-audio (Web Audio API)
  ├── Mouse Position         use-mouse (raw + normalized)
  ├── Auth Modal State       AuthContext (open/view)
  └── Window Size            use-window-size (debounced)
```

## Camera System

The `CameraRig` component drives the Three.js camera directly in `useFrame`:

1. **Mouse parallax** — `useMouse` normalized coords `[-1, 1]` map to angular offsets
2. **Lerp smoothing** — `1 - Math.pow(1 - lerpFactor, dt * 60)` provides frame-rate-independent smoothing
3. **Optional shake** — `CameraShake` adds organic micro-drift via multi-frequency sine waves
4. **Orbital drift** — `OrbitalDrift` loops the camera on a slow circular path (ambient scenes)

## Shader Architecture

All custom shaders follow a consistent pattern:

```glsl
// Vertex: compute per-vertex data, pass to fragment as varyings
// Fragment: compute final color from varyings + uniforms

// Uniforms updated each frame via useFrame:
material.uniforms.uTime.value = state.clock.elapsedTime
```

Key shaders:
- **StarField** — `gl_PointSize` with depth-based attenuation + twinkle via `sin(uTime + aSeed)`
- **NebulaCloud** — Billboard sprites with UV rotation + Gaussian alpha falloff
- **AsteroidBelt** — Per-instance rotation matrix applied in vertex shader (no CPU work)
- **SpaceDebris** — Point sprites with velocity-based drift, fade in/out lifecycle

## Loading State Machine

```
booting (0–15%)
    ↓ (simulated: 200ms)
assets (15–45%)
    ↓ (simulated: 600ms + real asset load hooks)
scene (45–65%)
    ↓ (Three.js scene initialization)
shaders (65–85%)
    ↓ (GLSL compilation)
ready (85–100%)
    ↓ (100ms hold)
done
    ↓ (LoadingScreen exits via AnimatePresence)
[experience visible]
```

Connect real asset loading by calling `setPhase('assets')` etc. from Three.js `useLoader` callbacks.

## Performance Budget

| Resource | Target | Notes |
|---|---|---|
| FPS | 60 (desktop) / 30 (mobile) | Auto-degrades via quality presets |
| Draw calls | < 20 | Particles merged into single Points mesh |
| Triangles | < 500k | Instanced geometry for asteroids |
| Texture memory | < 64MB | Compressed formats preferred |
| JS bundle (3D) | < 400KB gzipped | Dynamic import isolates Three.js |
| LCP | < 2.5s | Loading screen masks hydration |
| CLS | 0 | Fixed viewport layout |

## Route Strategy

| Route | Rendering | Notes |
|---|---|---|
| `/` | Hybrid (SSR shell + CSR canvas) | SEO-friendly landing |
| `/experience` | Full CSR | Fixed viewport, no scroll |
| `/api/health` | Edge | Lightweight health check |

## Auth Flow (Pending Implementation)

```
User clicks CTA
    ↓
AuthContext.openSignIn()
    ↓
AuthModal renders (Framer Motion AnimatePresence)
    ↓
User submits credentials
    ↓
supabase.auth.signInWithPassword()
    ↓
Session stored in cookie (Supabase SSR)
    ↓
Router refresh → Server Components re-render with auth state
    ↓
AuthModal closes
```

## Animation Philosophy

1. **GSAP for DOM** — ScrollTrigger-based reveals, counter animations, complex timelines
2. **Framer Motion for React** — Mount/unmount transitions, layout animations, gesture response
3. **useFrame for Three.js** — Every camera movement, particle update, uniform write
4. **Lenis for scroll** — Smooth scroll easing passed to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`

Never mix animation systems on the same property.

## CSS Architecture

```
styles/globals.css
  ├── @tailwind directives
  ├── :root CSS custom properties (Shadcn tokens → LUMINA palette)
  ├── @layer base (scrollbar, body, selection)
  ├── @layer components
  │     ├── .glass-panel
  │     ├── .glass-panel-light
  │     ├── .hud-label
  │     ├── .scan-lines
  │     ├── .noise-overlay
  │     ├── .gradient-border
  │     ├── .shimmer-skeleton
  │     └── .floating
  └── @layer utilities (custom utilities)
```

## Accessibility

- Reduced motion: `prefersReducedMotion()` utility disables non-essential animations
- Keyboard navigation: all interactive elements are focusable with visible focus rings (`focus-visible`)
- Screen readers: Three.js canvas has `aria-hidden="true"` — content conveyed through HTML
- Contrast: minimum 4.5:1 on all text against backgrounds
- Mobile: touch-friendly tap targets (≥ 44px), no hover-only interactions

## File Naming Conventions

| Pattern | Example | Usage |
|---|---|---|
| `PascalCase.tsx` | `StarField.tsx` | React components |
| `use-kebab-case.ts` | `use-mouse.ts` | Custom hooks |
| `kebab-case.ts` | `framer-variants.ts` | Utilities/libs |
| `SCREAMING_SNAKE` | `QUALITY_PRESETS` | Constants objects |
| `camelCase` | `lerpFactor` | Variables/props |
