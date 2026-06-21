"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — OAuth Callback Page (client-side)
//
// Why client-side and not a route handler:
//   PKCE flow stores the code verifier in browser localStorage. A server-side
//   route handler cannot access localStorage, so `exchangeCodeForSession` fails
//   on the server. This page runs in the browser and can access the stored
//   verifier automatically via the Supabase JS client.
//
// This page handles both:
//   • PKCE flow  — ?code=xxx   (Google OAuth with flowType: "pkce")
//   • Implicit   — #access_token=xxx  (handled by detectSessionInUrl: true)
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    async function handle() {
      // PKCE flow: ?code=xxx  — exchange code using the verifier in localStorage
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("[auth/callback] PKCE exchange failed:", error.message);
        }
        router.replace("/");
        return;
      }

      // Implicit flow: #access_token=xxx  — detectSessionInUrl handles it
      // Just wait a tick for the client to parse the hash, then redirect
      const hash = window.location.hash;
      if (hash.includes("access_token")) {
        // The Supabase client picks this up via detectSessionInUrl on its own.
        // Give it a moment to set the session before navigating away.
        await new Promise((r) => setTimeout(r, 200));
        router.replace("/");
        return;
      }

      // No code or token — something went wrong, return to login
      router.replace("/auth/login");
    }

    handle();
  }, [router]);

  return (
    <div className="min-h-screen bg-lumina-void flex flex-col items-center justify-center gap-4">
      {/* Minimal, no-cursor loading state — CursorTrail is not mounted here */}
      <div
        className="w-8 h-8 rounded-full border-t border-r border-lumina-star/30 animate-spin"
        aria-hidden
      />
      <p
        className="font-mono uppercase tracking-[0.25em] text-lumina-star/30"
        style={{ fontSize: "0.6875rem" }}
      >
        Authenticating
      </p>
    </div>
  );
}
