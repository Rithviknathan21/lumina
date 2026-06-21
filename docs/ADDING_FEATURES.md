# Adding Features to LUMINA

## Adding a New Three.js Component

1. Create `components/three/MyComponent.tsx`
2. Export from `components/three/index.ts`
3. Add to `SceneCanvas.tsx` inside `<SceneEnvironment>`

**Template:**

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function MyComponent() {
  const ref = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    // Create geometry + material once
    const geo = new THREE.BufferGeometry()
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
    })
    return { geometry: geo, material: mat }
  }, [])

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return <points ref={ref} geometry={geometry} material={material} />
}
```

---

## Adding a New Page

1. Create `app/my-page/page.tsx` (Server Component by default)
2. Add route to `ROUTES` in `lib/constants.ts`
3. Add nav link to `Navigation.tsx` if needed

```tsx
// app/my-page/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page — LUMINA',
}

export default function MyPage() {
  return (
    <main>
      {/* Use 'use client' in child components that need interactivity */}
    </main>
  )
}
```

---

## Adding a New Hook

1. Create `hooks/use-my-hook.ts`
2. Export from `hooks/index.ts`

```ts
// hooks/use-my-hook.ts
'use client'

import { useState, useEffect } from 'react'

export function useMyHook(options = {}) {
  const [state, setState] = useState(null)
  // ...
  return { state }
}
```

---

## Adding Authentication Logic

The auth shell is ready in `components/auth/AuthModal.tsx`.

1. **Install SSR helpers:**
   ```bash
   pnpm add @supabase/ssr
   ```

2. **Create server client** in `lib/supabase-server.ts`:
   ```ts
   import { createServerClient } from '@supabase/ssr'
   import { cookies } from 'next/headers'
   
   export function createClient() {
     const cookieStore = cookies()
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
       { cookies: { getAll: () => cookieStore.getAll(), setAll: (...) => ... } }
     )
   }
   ```

3. **Implement handlers** in `AuthModal.tsx → AuthFormSlot`:
   ```ts
   const { error } = await supabase.auth.signInWithPassword({ email, password })
   ```

4. **Add middleware** at `middleware.ts` for protected routes.

5. **Add `AuthProvider`** to `app/providers.tsx`.

---

## Adding a Supabase Table

1. Create a new migration:
   ```bash
   npx supabase migration new my_table
   ```

2. Write SQL in `supabase/migrations/xxx_my_table.sql`

3. Add TypeScript types to `types/database.ts`:
   ```ts
   my_table: {
     Row: { id: string; ... }
     Insert: { ... }
     Update: { ... }
   }
   ```

4. Push to remote:
   ```bash
   npx supabase db push
   ```

---

## Adding GSAP Animations

All GSAP utilities live in `animations/gsap.ts`.

```ts
// Use inside a useGSAP() callback:
import { useGSAP } from '@/hooks'
import { revealUp, staggerReveal } from '@/animations'

function MySection() {
  const containerRef = useRef(null)

  useGSAP(() => {
    revealUp('.my-title')
    staggerReveal('.my-card', { stagger: 0.1 })
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <h2 className="my-title">Title</h2>
      <div className="my-card">Card 1</div>
      <div className="my-card">Card 2</div>
    </div>
  )
}
```

---

## Performance Checklist for New Features

- [ ] Is any Three.js object created inside `useFrame`? → Move to `useMemo`
- [ ] Are textures loading on every render? → Use `useTexture` from drei
- [ ] Is a new DOM animation using JS setInterval? → Use GSAP ticker or `useFrame`
- [ ] Does the component re-render on mouse move? → Memoize or use refs
- [ ] Does it run on mobile? → Test at 360×800, respect `prefersReducedMotion()`
- [ ] Does it add draw calls? → Check with `renderer.info.render.calls` in dev
