import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-lumina-void flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(168,200,255,0.04) 0%, transparent 70%)" }} />
      <div className="relative z-10">
        <p className="font-mono text-2xs uppercase tracking-[0.25em] text-lumina-star/30 mb-6">Navigation Error</p>
        <h1 className="font-display font-black text-lumina-star-core mb-4"
          style={{ fontSize: "clamp(5rem, 14vw, 10rem)", lineHeight: 1, letterSpacing: "-0.04em", textShadow: "0 0 80px rgba(168,200,255,0.15)" }}>
          404
        </h1>
        <p className="text-lumina-star/45 mb-10 max-w-sm mx-auto leading-relaxed">
          You&apos;ve drifted beyond known space. This coordinate doesn&apos;t exist in our star charts.
        </p>
        <Link href={ROUTES.HOME}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-lumina-star text-lumina-void font-mono text-sm tracking-[0.1em] uppercase font-semibold hover:bg-lumina-star-bright transition-all duration-300"
          style={{ boxShadow: "0 0 30px rgba(168,200,255,0.2)" }}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
