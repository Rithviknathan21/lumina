import type { MetadataRoute } from "next";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Robots
// ─────────────────────────────────────────────────────────────────────────────

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://lumina.space";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/callback", "/profile"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
