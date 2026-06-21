# LUMINA Design System

## Principles

1. **Cinematic depth** — Every surface has layers: void → glass → content
2. **Restraint** — Use color sparingly. Most UI is white/5–20% on void.
3. **Motion with purpose** — Nothing animates unless it communicates
4. **Legibility first** — Blur and transparency yield to readability

---

## Color Palette

```
lumina-void     #020408   ████  Deep space. Page background.
lumina-deep     #060C14   ████  Card/panel background.
lumina-cosmos   #0D1B2E   ████  Section dividers, mid-depth.
lumina-star     #A8C8FF   ████  Primary brand. Links, icons, CTAs.
lumina-violet   #7B5EA7   ████  Secondary. Nebula, premium badges.
lumina-solar    #F5A623   ████  Highlight. Rare; only for key moments.
```

### Usage Rules

- **Never** use `lumina-star` for body text — reserve for accent/interactive only
- **lumina-solar** appears max 1–2 times per page
- Glass surfaces use `white/5` to `white/15` — avoid opaque panels
- Text hierarchy: `white` → `white/70` → `white/40` → `white/20`

---

## Typography

```css
font-display   /* Syne — headings, hero text */
font-sans      /* Inter — body, UI text */
font-mono      /* JetBrains Mono — HUD, code, data */
```

### Scale

| Class | Size | Usage |
|---|---|---|
| `text-xs` | 12px | HUD labels, captions |
| `text-sm` | 14px | Body, form labels |
| `text-base` | 16px | Default body |
| `text-lg` | 18px | Card titles |
| `text-xl` | 20px | Section subtitles |
| `text-2xl` | 24px | Modal headings |
| `text-4xl` | 36px | Page headings |
| `text-6xl` | 60px | Hero headings |
| `text-8xl` | 96px | Display / cinematic |

### HUD Labels (Monospace)

Always: `font-mono uppercase tracking-widest text-xs text-white/40`

```tsx
<HUDLabel bright>// SECTION TITLE</HUDLabel>
<HUDLabel dim>subsystem: active</HUDLabel>
<HUDDataRow label="VELOCITY" value="0.3c" />
```

---

## Glassmorphism

### Panel Variants

```tsx
// Default — most common. Subtle glass.
<GlassPanel>content</GlassPanel>

// Light — on darker backgrounds
<GlassPanel variant="light">content</GlassPanel>

// Heavy — modals, overlays
<GlassPanel variant="heavy">content</GlassPanel>

// Bordered — tables, data displays
<GlassPanel variant="bordered">content</GlassPanel>
```

### Manual Glass

```css
/* Tailwind classes for custom glass */
.my-glass {
  @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl;
}
```

---

## Buttons

```tsx
<LuminaButton variant="primary">Launch Experience</LuminaButton>
<LuminaButton variant="secondary">Learn More</LuminaButton>
<LuminaButton variant="ghost">View All</LuminaButton>
<LuminaButton variant="solar">Special Action</LuminaButton>

/* With loading state */
<LuminaButton loading>Processing</LuminaButton>

/* With icon */
<LuminaButton icon={<ArrowRight className="w-4 h-4" />}>
  Explore
</LuminaButton>
```

---

## Animations

### Framer Motion

```tsx
import { fadeUpVariants, staggerContainerVariants } from '@/animations'

// Staggered reveal
<motion.div variants={staggerContainerVariants(0.1)} initial="hidden" animate="visible">
  <motion.div variants={fadeUpVariants}>Item 1</motion.div>
  <motion.div variants={fadeUpVariants}>Item 2</motion.div>
</motion.div>

// Glass panel entrance
<motion.div variants={glassPanelVariants} initial="hidden" animate="visible" />

// Modal
<motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" />
```

### GSAP

```ts
import { revealUp, staggerReveal, countTo } from '@/animations'

// Reveal element on mount
revealUp('.hero-title', { delay: 0.3 })

// Stagger children
staggerReveal('.card', { stagger: 0.08 })

// Animated counter
countTo('.stat-number', 4000, { prefix: '', suffix: '+' })

// Scroll-triggered reveal
scrollReveal('.section-content')
```

---

## Shadows & Glow

```css
/* Star glow */
shadow-[0_0_20px_rgba(168,200,255,0.3)]

/* Solar glow */
shadow-[0_0_20px_rgba(245,166,35,0.4)]

/* Violet glow */
shadow-[0_0_20px_rgba(123,94,167,0.35)]

/* Subtle depth */
shadow-2xl shadow-black/50
```

---

## Spacing

Follow Tailwind's 4px base unit. Key spacing tokens:

| Use case | Tailwind |
|---|---|
| Section padding | `py-24 lg:py-32` |
| Card padding | `p-6 lg:p-8` |
| Component gap | `gap-4` or `gap-6` |
| HUD item gap | `gap-2` |
| Icon + text | `gap-2` |

---

## Border Radius

```
rounded-sm    4px   — Badges, pills
rounded-lg    8px   — Inputs, buttons
rounded-xl    12px  — Cards, panels
rounded-2xl   16px  — Modals
rounded-3xl   24px  — Large sections
rounded-full  —     — Pills, avatars, toggles
```

---

## Z-Index Scale

```ts
// lib/constants.ts Z_INDEX
CANVAS: -1        // Three.js background
BASE: 0           // Normal flow
OVERLAY: 10       // Dropdowns, tooltips
HUD: 50           // In-experience HUD
NAVIGATION: 60    // Top nav
MODAL_BACKDROP: 90
MODAL: 91
LOADING: 100      // Always on top
```

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `backdrop-blur-xl` on glass panels | Use solid white/grey backgrounds |
| Use `font-mono uppercase tracking-widest` for labels | Mix font families randomly |
| Use `lumina-star` for interactive elements | Use `lumina-solar` as a primary color |
| Keep text at `white/70` or lower for body | Use pure white for all text |
| Animate with `useFrame` inside Three.js | Animate Three.js objects with GSAP |
| Use `AnimatePresence` for unmount animations | Use CSS transitions for complex unmounts |
| Use `GlassPanel` for all card surfaces | Create new glass styles from scratch |
