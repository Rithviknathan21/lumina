"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, User, Globe, Bookmark, Star } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Profile Page
// ─────────────────────────────────────────────────────────────────────────────

const SAVED_PLANETS = [
  { name: "Earth", desc: "Home — Sol III", color: "#4B9EFF" },
  { name: "Mars", desc: "The Red Planet — Sol IV", color: "#E8603C" },
  { name: "Saturn", desc: "Lord of the Rings — Sol VI", color: "#E8C97D" },
];

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace(ROUTES.AUTH.LOGIN);
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-lumina-void flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-lumina-star/30 border-t-lumina-star animate-spin" />
      </div>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const name = (user.user_metadata?.full_name as string) ?? user.email?.split("@")[0] ?? "Explorer";

  return (
    <div className="min-h-screen bg-lumina-void">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 30% 20%, rgba(168,200,255,0.04) 0%, transparent 60%)" }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-30 px-6 h-16 flex items-center justify-between border-b border-white/[0.06] bg-lumina-void/80 backdrop-blur-xl">
        <Link href={ROUTES.HOME} className="font-display font-bold tracking-[0.2em] text-lumina-star-core text-sm uppercase">LUMINA</Link>
        <button onClick={signOut} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-mono text-xs uppercase tracking-[0.12em]">
          <LogOut size={13} />Sign Out
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20 relative z-10">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center gap-6 mb-12">
          <div className="relative">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={name} className="w-20 h-20 rounded-full border-2 border-lumina-star/20" />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-lumina-star/20 bg-lumina-star/[0.06] flex items-center justify-center">
                <User size={28} className="text-lumina-star/40" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-lumina-void" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">{name}</h1>
            <p className="text-white/40 text-sm mt-1">{user.email}</p>
            <p className="font-mono text-[10px] text-lumina-star/40 uppercase tracking-[0.15em] mt-2">
              Explorer · Since {new Date(user.created_at).getFullYear()}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-3 gap-4 mb-10">
          {[{ icon: Globe, label: "Planets Visited", value: "3" }, { icon: Star, label: "Stars Discovered", value: "2,847" }, { icon: Bookmark, label: "Bookmarks", value: "12" }].map(s => (
            <GlassPanel key={s.label} className="p-5 text-center">
              <s.icon size={16} className="text-lumina-star/40 mx-auto mb-3" />
              <div className="font-mono text-2xl font-semibold text-lumina-star">{s.value}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25 mt-1">{s.label}</div>
            </GlassPanel>
          ))}
        </motion.div>

        {/* Saved Planets */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-5 flex items-center gap-3">
            <span className="w-5 h-px bg-white/20" />Saved Destinations
          </h2>
          <div className="space-y-3">
            {SAVED_PLANETS.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}>
                <GlassPanel className={cn("p-4 flex items-center gap-4 hover:border-white/[0.12] transition-all duration-300 cursor-pointer")}>
                  <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: `radial-gradient(circle at 35% 35%, ${p.color}80, ${p.color}20)`, boxShadow: `0 0 20px ${p.color}30` }} />
                  <div>
                    <div className="text-white font-semibold text-sm">{p.name}</div>
                    <div className="text-white/30 text-xs font-mono mt-0.5">{p.desc}</div>
                  </div>
                  <Bookmark size={13} className="ml-auto text-lumina-star/30" />
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Launch CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 text-center">
          <Link href={ROUTES.EXPERIENCE}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-lumina-void bg-lumina-star hover:bg-lumina-star-bright transition-all duration-300"
            style={{ boxShadow: "0 0 40px rgba(168,200,255,0.2)" }}>
            <Globe size={14} />Continue Exploring
          </Link>
        </motion.div>

        {/* Creator credit */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center font-mono select-none"
          style={{ fontSize: "0.6rem", color: "rgba(168,200,255,0.2)", letterSpacing: "0.15em" }}
        >
          Crafted by Rithviknathan M&nbsp;&nbsp;✦&nbsp;&nbsp;rithvikrithvik77@gmail.com
        </motion.p>
      </main>
    </div>
  );
}
