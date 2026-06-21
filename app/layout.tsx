import type { Metadata, Viewport } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { BackgroundCanvas } from "@/components/layout/BackgroundCanvas";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Root Layout
// ─────────────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://lumina.space";
const OG_DESCRIPTION =
  "An immersive 3D space exploration experience. Fly through the solar system, visit Mars, Europa, and Titan, and peer into the deep cosmos from the Observatory.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s — ${APP_NAME}`,
  },
  description: OG_DESCRIPTION,
  keywords: [
    "space exploration",
    "3D cosmos",
    "immersive experience",
    "solar system",
    "Mars",
    "Europa",
    "Titan",
    "nebula",
    "WebGL",
    "Three.js",
  ],
  authors: [{ name: APP_NAME, url: APP_URL }],
  creator: APP_NAME,
  publisher: APP_NAME,
  category: "Entertainment",
  openGraph: {
    type: "website",
    url: APP_URL,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: OG_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — ${APP_TAGLINE}`,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: OG_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: "@luminaspace",
    site: "@luminaspace",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020408" },
    { media: "(prefers-color-scheme: light)", color: "#020408" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preconnect to font servers */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-lumina-void text-lumina-star-core antialiased">
        {/* Skip navigation — keyboard-only link, visually hidden until focused */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
          style={{
            background: "rgba(3,6,16,0.95)",
            border: "1px solid rgba(168,200,255,0.3)",
            color: "#a8c8ff",
          }}
        >
          Skip to main content
        </a>

        {/* Fixed 3D space scene — mounts once at layout level, lives forever.
            Lives outside the page React tree so no page re-render can touch it. */}
        <BackgroundCanvas />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
