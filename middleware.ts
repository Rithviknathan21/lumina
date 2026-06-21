import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Middleware
// Protects /profile route. Auth callback is always public.
// ─────────────────────────────────────────────────────────────────────────────

const PROTECTED = ["/profile"];
const AUTH_COOKIE = "sb-access-token"; // Supabase sets this

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow auth routes through always
  if (pathname.startsWith("/auth")) return NextResponse.next();

  // Check protected routes
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    const token =
      request.cookies.get(AUTH_COOKIE) ??
      request.cookies.get("sb-" + process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0] + "-auth-token");

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
