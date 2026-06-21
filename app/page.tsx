"use client";

import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TechSection } from "@/components/sections/TechSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { PlanetExploreSection } from "@/components/explore/PlanetExploreSection";
import { ObservatorySection } from "@/components/observatory/ObservatorySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CursorTrail } from "@/components/shared/CursorTrail";
import { Footer } from "@/components/layout/Footer";
import { WarpTransition } from "@/components/effects/WarpTransition";
import { ScrollProgressIndicator } from "@/components/effects/ScrollProgressIndicator";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

// ─────────────────────────────────────────────────────────────────────────────
// LUMINA — Home Page
// SceneCanvas lives in layout.tsx (mounts once, never unmounts).
// This page renders only the scrollable content layer.
// ─────────────────────────────────────────────────────────────────────────────

function SectionDivider() {
  return <WarpTransition />;
}

export default function HomePage() {
  return (
    <>
      {/* Custom cursor trail — above everything */}
      <CursorTrail />

      {/* Scroll progress indicator — fixed right edge */}
      <ScrollProgressIndicator />

      {/* Floating navigation */}
      <Navigation />

      {/* Scrollable content layer */}
      <main id="main-content" className="relative z-10">
        {/* ── Hero ── viewport-height, transparent — user sees Earth directly */}
        <ErrorBoundary label="Hero">
          <HeroSection />
        </ErrorBoundary>

        <WarpTransition label="EXPERIENCE" />

        {/* ── Features ── */}
        <ErrorBoundary label="Experience">
          <FeaturesSection />
        </ErrorBoundary>

        <WarpTransition label="DESTINATIONS" />

        {/* ── Destinations ── */}
        <ErrorBoundary label="Destinations">
          <DestinationsSection />
        </ErrorBoundary>

        <WarpTransition label="TIMELINE" />

        {/* ── Journey Timeline ── */}
        <ErrorBoundary label="Timeline">
          <TimelineSection />
        </ErrorBoundary>

        <WarpTransition label="EXPLORE" />

        {/* ── Planet Exploration ── (heaviest 3D section) */}
        <ErrorBoundary label="Planet Exploration">
          <PlanetExploreSection />
        </ErrorBoundary>

        <WarpTransition label="OBSERVATORY" />

        {/* ── Observatory ── */}
        <ErrorBoundary label="Observatory">
          <ObservatorySection />
        </ErrorBoundary>

        <SectionDivider />

        <ErrorBoundary label="Services">
          <ServicesSection />
        </ErrorBoundary>

        <SectionDivider />

        <ErrorBoundary label="Technology">
          <TechSection />
        </ErrorBoundary>

        <SectionDivider />

        <ErrorBoundary label="Missions">
          <ProjectsSection />
        </ErrorBoundary>

        <SectionDivider />

        <ErrorBoundary label="Testimonials">
          <TestimonialsSection />
        </ErrorBoundary>

        <SectionDivider />

        <ErrorBoundary label="Contact">
          <ContactSection />
        </ErrorBoundary>

        {/* ── Footer ── */}
        <Footer />
      </main>
    </>
  );
}
