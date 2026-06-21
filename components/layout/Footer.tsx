"use client";

import Link from "next/link";
import { APP_NAME, APP_TAGLINE, ROUTES } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Footer
// NOTE: year rendered with suppressHydrationWarning to avoid SSR mismatch
// ─────────────────────────────────────────────────────────────────────────────

const LINKS = [
  {
    group: "Experience",
    items: [
      { label: "Launch", href: ROUTES.EXPERIENCE },
      { label: "Features", href: "#features" },
      { label: "Technology", href: "#technology" },
    ],
  },
  {
    group: "Company",
    items: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    group: "Legal",
    items: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-lumina-glass-border bg-gradient-to-t from-lumina-void to-transparent" role="contentinfo">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lumina-star/12 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href={ROUTES.HOME} className="inline-block">
              <span className="font-display text-xl font-bold tracking-[0.18em] text-lumina-star-core uppercase"
                style={{ textShadow: "0 0 20px rgba(168,200,255,0.2)" }}>
                {APP_NAME}
              </span>
            </Link>
            <p className="mt-3 text-sm text-lumina-star/40 leading-relaxed max-w-xs">{APP_TAGLINE}</p>
          </div>
          {/* Link groups */}
          {LINKS.map((group) => (
            <div key={group.group}>
              <h3 className="font-mono text-2xs uppercase tracking-[0.2em] text-lumina-star/30 mb-4">{group.group}</h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-lumina-star/50 hover:text-lumina-star transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-lumina-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* suppressHydrationWarning prevents SSR/client year mismatch */}
          <p className="font-mono text-2xs text-lumina-star/25 tracking-[0.15em] uppercase" suppressHydrationWarning>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>

          {/* Creator signature */}
          <div
            className="font-mono text-2xs tracking-[0.18em] select-none flex flex-col items-center gap-0.5"
            style={{
              color: "rgba(168,200,255,0.32)",
              background: "rgba(168,200,255,0.03)",
              border: "1px solid rgba(168,200,255,0.07)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: "999px",
              padding: "0.4rem 1.1rem",
              letterSpacing: "0.18em",
              textShadow: "0 0 18px rgba(168,200,255,0.15)",
            }}
          >
            <span>Crafted by Rithviknathan M&nbsp;&nbsp;✦</span>
            <span style={{ opacity: 0.65, fontSize: "0.6rem", letterSpacing: "0.1em" }}>
              rithvikrithvik77@gmail.com
            </span>
          </div>

          <p className="font-mono text-2xs text-lumina-star/20 tracking-[0.15em]">Built for the cosmos.</p>
        </div>
      </div>
    </footer>
  );
}
