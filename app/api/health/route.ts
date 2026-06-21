import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Health Check API
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      status: "ok",
      service: "lumina-api",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "1.0.0",
    },
    { status: 200 }
  );
}
