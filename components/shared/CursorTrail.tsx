"use client";

import { useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Cursor Energy Field & Particle Trail
// All Math.random() calls are inside useCallback / event handlers — client only
// ─────────────────────────────────────────────────────────────────────────────

interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number }
interface Ripple { x: number; y: number; r: number; maxR: number; alpha: number; speed: number }

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  // Mark body so CSS can scope cursor:none only to pages with this component.
  // Restores the OS cursor automatically when CursorTrail unmounts.
  useEffect(() => {
    document.body.dataset.cursorActive = "true";
    return () => { delete document.body.dataset.cursorActive; };
  }, []);
  const ripples = useRef<Ripple[]>([]);
  const mouse = useRef({ x: -999, y: -999, px: -999, py: -999 });
  const rafRef = useRef<number>(0);
  const lastMoveTime = useRef<number>(0);

  const spawnParticles = useCallback((x: number, y: number, speed: number) => {
    const n = Math.min(2 + Math.floor(speed), 5);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (0.3 + Math.random() * 0.6) * (0.4 + speed * 0.2);
      particles.current.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.2,
        life: 1, maxLife: 0.5 + Math.random() * 0.6,
        size: 1.2 + Math.random() * 2.0,
        hue: 200 + Math.random() * 60,
      });
    }
    if (particles.current.length > 60) particles.current.splice(0, particles.current.length - 60);
  }, []);

  const spawnRipple = useCallback((x: number, y: number) => {
    ripples.current.push({ x, y, r: 0, maxR: 55 + Math.random() * 40, alpha: 0.45, speed: 2.5 + Math.random() * 2 });
    if (ripples.current.length > 7) ripples.current.shift();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveTime.current < 8) return; // throttle to ~120fps
      lastMoveTime.current = now;
      const m = mouse.current;
      const vx = e.clientX - m.x; const vy = e.clientY - m.y;
      m.px = m.x; m.py = m.y; m.x = e.clientX; m.y = e.clientY;
      spawnParticles(e.clientX, e.clientY, Math.sqrt(vx * vx + vy * vy) / 20);
    };
    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) spawnRipple(e.clientX, e.clientY);
      spawnParticles(e.clientX, e.clientY, 3);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dt = 1 / 60;

    const frame = () => {
      rafRef.current = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const m = mouse.current;

      // Cursor glow — fixed alpha, no per-frame gradient recreation
      if (m.x > -900) {
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 22);
        g.addColorStop(0, "rgba(168,200,255,0.42)");
        g.addColorStop(0.45, "rgba(100,160,255,0.10)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(m.x, m.y, 22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(m.x, m.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,220,255,0.88)"; ctx.fill();
      }

      // Ripples
      ripples.current = ripples.current.filter((r) => {
        r.r += r.speed; r.alpha *= 0.93;
        if (r.r >= r.maxR || r.alpha < 0.01) return false;
        const t = r.r / r.maxR;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168,200,255,${r.alpha * (1 - t)})`;
        ctx.lineWidth = 1.4 * (1 - t); ctx.stroke();
        return true;
      });

      // Particles
      particles.current = particles.current.filter((p) => {
        p.life -= dt / p.maxLife; if (p.life <= 0) return false;
        const dx = m.x - p.x; const dy = m.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 18 && dist < 190) { const f = 0.014 / dist; p.vx += dx * f; p.vy += dy * f; }
        p.vx *= 0.97; p.vy *= 0.97; p.x += p.vx; p.y += p.vy;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},88%,74%,${p.life * 0.75})`; ctx.fill();
        return true;
      });
    };
    frame();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, [spawnParticles, spawnRipple]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-[200] pointer-events-none"
      style={{ mixBlendMode: "screen" }} aria-hidden />
  );
}
