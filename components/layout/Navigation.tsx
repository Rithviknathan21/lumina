"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { navVariants, mobileMenuVariants, staggerContainerVariants, staggerItemVariants } from "@/animations/framer-variants";
import { scrollTo } from "@/hooks/use-lenis";
import { useAuth } from "@/components/auth";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Navigation
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Experience", href: ROUTES.EXPERIENCE },
  { label: "Features",   href: "#features"        },
  { label: "Technology", href: "#technology"      },
  { label: "About",      href: "#about"           },
] as const;

function Logo() {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group" aria-label={`${APP_NAME} — Home`}>
      <div className="w-7 h-7">
        <svg viewBox="0 0 28 28" fill="none" className="w-full h-full" aria-hidden>
          <circle cx="14" cy="14" r="12" stroke="rgba(168,200,255,0.18)" strokeWidth="1"
            className="group-hover:stroke-lumina-star/45 transition-all duration-500" />
          <circle cx="14" cy="14" r="5.5" fill="none" stroke="#A8C8FF" strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 5px rgba(168,200,255,0.6))" }} />
          <circle cx="14" cy="14" r="1.8" fill="#A8C8FF"
            style={{ filter: "drop-shadow(0 0 3px rgba(168,200,255,0.9))" }} />
          <circle cx="14" cy="2" r="1" fill="rgba(168,200,255,0.45)"
            className="group-hover:fill-lumina-star transition-colors duration-300" />
        </svg>
      </div>
      <span className="font-display text-[14px] font-bold tracking-[0.22em] text-white uppercase"
        style={{ textShadow: "0 0 20px rgba(168,200,255,0.3)" }}>
        {APP_NAME}
      </span>
    </Link>
  );
}

function MagneticLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 300, damping: 26 });
  const sy = useSpring(my, { stiffness: 300, damping: 26 });
  const isAnchor = href.startsWith("#");

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.28);
    my.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  const onLeave = () => { mx.set(0); my.set(0); };
  const onClick_ = (e: React.MouseEvent) => {
    if (isAnchor) { e.preventDefault(); scrollTo(href); }
    onClick?.();
  };

  return (
    <motion.a ref={ref} href={href} onClick={onClick_} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="relative font-mono text-[11px] tracking-[0.14em] uppercase py-1.5 px-1 text-white/38 hover:text-lumina-star transition-colors duration-300 group">
      {label}
      <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-lumina-star scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
    </motion.a>
  );
}

interface NavigationProps {
  transparent?: boolean;
}

export function Navigation({ transparent = false }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user, signOut } = useAuth();

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? y / max : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    if (mobileOpen) document.body.setAttribute("data-scroll-locked", "");
    else document.body.removeAttribute("data-scroll-locked");
    return () => document.body.removeAttribute("data-scroll-locked");
  }, [mobileOpen]);

  const showBg = scrolled || !transparent;

  return (
    <>
      <motion.header className="fixed top-0 left-0 right-0 z-[60]"
        variants={navVariants} initial="hidden" animate="visible">
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-4">
          <div className={cn(
            "relative flex items-center justify-between px-6 h-14 rounded-2xl transition-all duration-500",
            showBg ? "bg-lumina-void/72 backdrop-blur-2xl border border-white/[0.065] shadow-[0_4px_32px_rgba(0,0,0,0.55)]" : "bg-transparent"
          )}>
            {showBg && <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-lumina-star/12 to-transparent" />}
            <Logo />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => <MagneticLink key={item.href} href={item.href} label={item.label} />)}
            </nav>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href={ROUTES.PROFILE}
                    className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-white/35 hover:text-lumina-star transition-colors duration-300">
                    <User size={12} />{user.email?.split("@")[0] ?? "Profile"}
                  </Link>
                  <button onClick={signOut}
                    className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/25 hover:text-white/55 transition-colors duration-300">
                    <LogOut size={12} />
                  </button>
                </div>
              ) : (
                <Link href={ROUTES.AUTH.LOGIN}
                  className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/30 hover:text-lumina-star/70 transition-colors duration-300">
                  Sign in
                </Link>
              )}
              <Link href={ROUTES.EXPERIENCE}
                className={cn(
                  "px-5 py-2.5 rounded-full font-mono text-[11px] tracking-[0.14em] uppercase font-semibold",
                  "text-lumina-void bg-lumina-star hover:bg-lumina-star-bright",
                  "transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                )}
                style={{ boxShadow: "0 0 20px rgba(168,200,255,0.2),inset 0 1px 0 rgba(255,255,255,0.25)" }}>
                Launch
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-white/38 hover:text-lumina-star transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}>
              <AnimatePresence mode="wait">
                {mobileOpen
                  ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={18} /></motion.span>
                  : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={18} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Scroll progress */}
        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-lumina-star/0 via-lumina-star/45 to-lumina-star/0"
            style={{ scaleX: progress, transformOrigin: "left" }} />
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[55] flex flex-col md:hidden"
            variants={mobileMenuVariants} initial="closed" animate="open" exit="closed">
            <div className="absolute inset-0 bg-lumina-void/96 backdrop-blur-3xl" />
            <div className="relative flex flex-col h-full pt-28 px-8 pb-12">
              <motion.nav className="flex flex-col gap-2"
                variants={staggerContainerVariants(0.09)} initial="hidden" animate="visible">
                {NAV_ITEMS.map((item) => (
                  <motion.div key={item.href} variants={staggerItemVariants}>
                    <a href={item.href}
                      onClick={(e) => { if (item.href.startsWith("#")) { e.preventDefault(); scrollTo(item.href); } setMobileOpen(false); }}
                      className="block py-4 font-display text-3xl font-bold text-white/28 hover:text-white transition-colors duration-300">
                      {item.label}
                    </a>
                  </motion.div>
                ))}
              </motion.nav>
              <motion.div className="mt-auto flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Link href={ROUTES.EXPERIENCE} onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-4 rounded-2xl font-mono text-[11px] tracking-[0.2em] uppercase font-semibold text-lumina-void bg-lumina-star"
                  style={{ boxShadow: "0 0 40px rgba(168,200,255,0.3)" }}>
                  Launch Experience
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
