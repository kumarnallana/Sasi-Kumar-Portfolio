# Latest Codex Updates: Animation & Scrolling Architecture

This document contains the complete updated code for the 5 files modified by Codex, along with the full animation and scrolling CSS engine.

---

## The 5 Modified Files from Codex Review

### 1. `src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { identity } from "@/data/profile/profile.data";
import {
  SITE_URL,
  SITE_NAME,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  personJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "optional",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s - ${identity.name}`,
  },
  description: SEO_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: identity.name,
  authors: [{ name: identity.name, url: SITE_URL }],
  creator: identity.name,
  publisher: identity.name,
  category: "technology",
  alternates: { canonical: "/" },
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: identity.name,
    title: SITE_NAME,
    description: SEO_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SEO_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#060a16",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        {/* structured data - Person + WebSite for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

### 2. `src/app/page.tsx`

```tsx
import SmoothScroll from "@/components/scroll/SmoothScroll";
import BootSequence from "@/components/shell/BootSequence";
import HudFrame from "@/components/shell/HudFrame";
import DepthNav from "@/components/navigation/DepthNav";
import Hero from "@/components/hero/Hero";
import DeferredSections from "@/components/shell/DeferredSections";
import QueryProvider from "@/providers/query-provider";

export default function Home() {
  return (
    <SmoothScroll>
      {/* fixed console backdrop - grid + edge vignette stay put while content scrolls */}
      <div className="pointer-events-none fixed inset-0 -z-10 blueprint-grid" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--ink-900)_100%)]" />

      <BootSequence />
      <HudFrame />
      <DepthNav />

      <QueryProvider>
        <main className="relative">
          <Hero />
          <DeferredSections />
        </main>
      </QueryProvider>
    </SmoothScroll>
  );
}
```

---

### 3. `src/components/navigation/ScrollSnap.tsx`

```text
[DELETED BY CODEX]
Reason: Completely removed to eliminate unnatural/sticky scroll snapping.
This restores native, responsive trackpad and wheel scrolling throughout the site.
```

---

### 4. `src/components/scroll/SmoothScroll.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduce || !desktop) return;

    // Clean up legacy #architect anchor if present in URL bar
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#architect"
    ) {
      window.history.replaceState(null, "", "#profile");
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void Promise.all([
      import("lenis"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      setLenis(lenis);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        setLenis(null);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
```

---

### 5. `src/lib/lenis.ts`

```typescript
import type Lenis from "lenis";

// Lenis is instantiated inside <SmoothScroll/>; navigation can reuse that
// single desktop scroll owner without adding behavior to normal page scrolling.
let instance: Lenis | null = null;
let navigationRequest = 0;
let clearActiveNavigation: (() => void) | null = null;

export function setLenis(next: Lenis | null) {
  clearActiveNavigation?.();
  instance = next;
  navigationRequest += 1;
}

export function getLenis() {
  return instance;
}

function normalizeSectionId(id: string) {
  if (id === "architect" || id === "#architect") return "profile";
  return id.replace(/^#/, "");
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function moveToTarget(target: HTMLElement | number, reduce: boolean) {
  if (document.body.style.overflow === "hidden" || instance?.isStopped) return;

  clearActiveNavigation?.();
  const request = ++navigationRequest;

  if (instance && !reduce) {
    const scroller = instance;
    const cleanup = () => {
      window.removeEventListener("wheel", cancel, true);
      window.removeEventListener("touchstart", cancel, true);
      window.removeEventListener("pointerdown", cancel, true);
      if (clearActiveNavigation === cleanup) clearActiveNavigation = null;
    };
    const cancel = () => {
      if (request !== navigationRequest) {
        cleanup();
        return;
      }
      navigationRequest += 1;
      scroller.scrollTo(scroller.animatedScroll, {
        immediate: true,
        force: true,
      });
      cleanup();
    };

    window.addEventListener("wheel", cancel, { passive: true, capture: true });
    window.addEventListener("touchstart", cancel, {
      passive: true,
      capture: true,
    });
    window.addEventListener("pointerdown", cancel, {
      passive: true,
      capture: true,
    });
    clearActiveNavigation = cleanup;

    scroller.resize();
    scroller.scrollTo(target, {
      offset: 0,
      duration: 1.2,
      lock: false,
      onComplete: cleanup,
    });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "instant" });
  } else {
    target.scrollIntoView({ behavior: "instant", block: "start" });
  }
}

function waitForMountedSection(id: string, reduce: boolean) {
  const request = ++navigationRequest;
  let observer: MutationObserver | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    observer?.disconnect();
    if (timeoutId) clearTimeout(timeoutId);
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("pointerdown", cancel);
  };

  const cancel = () => {
    if (request !== navigationRequest) return;
    navigationRequest += 1;
    cleanup();
  };

  const tryFinish = () => {
    if (request !== navigationRequest) {
      cleanup();
      return true;
    }

    const section = document.getElementById(id);
    if (!section || section.dataset.deferredPlaceholder === "true")
      return false;

    cleanup();
    moveToTarget(section, reduce);
    return true;
  };

  if (tryFinish()) return;

  window.addEventListener("wheel", cancel, { passive: true, once: true });
  window.addEventListener("touchstart", cancel, { passive: true, once: true });
  window.addEventListener("pointerdown", cancel, { passive: true, once: true });

  observer = new MutationObserver(tryFinish);
  observer.observe(document.body, { childList: true, subtree: true });
  timeoutId = setTimeout(cleanup, 2000);
}

export function scrollToSection(rawId: string) {
  if (document.body.style.overflow === "hidden") return;

  const id = normalizeSectionId(rawId);
  const reduce = prefersReducedMotion();

  if (id === "top") {
    moveToTarget(0, reduce);
    return;
  }

  const section = document.getElementById(id);
  if (!section) return;

  if (section.dataset.deferredPlaceholder !== "true") {
    moveToTarget(section, reduce);
    return;
  }

  window.dispatchEvent(
    new CustomEvent("portfolio:section-request", { detail: id }),
  );
  waitForMountedSection(id, reduce);
}
```

---

## Associated Scrolling CSS & Animation Engine

### 6. `lenis/dist/lenis.css` (Imported into Root Layout)

```css
html.lenis,
html.lenis body {
  height: auto;
}

.lenis:not(.lenis-autoToggle).lenis-stopped {
  overflow: clip;
}

.lenis [data-lenis-prevent],
.lenis [data-lenis-prevent-wheel],
.lenis [data-lenis-prevent-touch],
.lenis [data-lenis-prevent-vertical],
.lenis [data-lenis-prevent-horizontal] {
  overscroll-behavior: contain;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}

.lenis.lenis-autoToggle {
  transition-property: overflow;
  transition-duration: 1ms;
  transition-behavior: allow-discrete;
}
```

### 7. `src/app/globals.css` (Animation & Scrolling Keyframes)

```css
html {
  scroll-behavior: auto; /* Handled smoothly by Lenis */
}

/* static scanlines laid over the whole boot screen */
.boot-scanlines {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(67, 201, 255, 0.06) 0px,
    rgba(67, 201, 255, 0.06) 1px,
    transparent 1px,
    transparent 3px
  );
}

/* a single bright scan beam sweeping top to bottom */
@keyframes scanbeam {
  0% {
    transform: translateY(-12vh);
    opacity: 0;
  }
  8% {
    opacity: 0.8;
  }
  92% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(112vh);
    opacity: 0;
  }
}
.boot-beam {
  animation: scanbeam 2.6s linear infinite;
}

/* subtle CRT flicker on the boot core */
@keyframes bootflicker {
  0%,
  88%,
  100% {
    opacity: 1;
  }
  90% {
    opacity: 0.82;
  }
  92% {
    opacity: 1;
  }
  94% {
    opacity: 0.9;
  }
}
.boot-flicker {
  animation: bootflicker 3.2s ease-in-out infinite;
}

/* the moment it breaks its constraint: a hard glitch */
@keyframes bootglitch {
  0% {
    transform: translate(0, 0);
    clip-path: inset(0 0 0 0);
  }
  15% {
    transform: translate(-3px, 1px);
    clip-path: inset(8% 0 62% 0);
  }
  30% {
    transform: translate(3px, -1px);
    clip-path: inset(54% 0 18% 0);
  }
  45% {
    transform: translate(-2px, 0);
    clip-path: inset(30% 0 40% 0);
  }
  60% {
    transform: translate(2px, 1px);
    clip-path: inset(70% 0 8% 0);
  }
  75% {
    transform: translate(-1px, 0);
    clip-path: inset(12% 0 50% 0);
  }
  100% {
    transform: translate(0, 0);
    clip-path: inset(0 0 0 0);
  }
}
.boot-glitch {
  animation: bootglitch 0.34s steps(2, end) 1;
}

/* blinking cursor */
@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}
.cursor-blink {
  animation: blink 1s step-end infinite;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 8. `src/lib/contentReveal.ts` (GSAP ScrollTrigger Helper)

```typescript
import { gsap } from "gsap";

/** Call inside section gsap.context so unmounting cleanly reverts the tween */
export function revealContent(targets: gsap.TweenTarget, vars: gsap.TweenVars) {
  const media = gsap.matchMedia();
  media.add(
    "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    () => {
      const motionVars = { ...vars };
      delete motionVars.opacity;
      if (
        motionVars.scrollTrigger &&
        typeof motionVars.scrollTrigger === "object"
      ) {
        motionVars.scrollTrigger = { ...motionVars.scrollTrigger, once: true };
      }
      gsap.from(targets, { ...motionVars, immediateRender: false });
    },
  );
}
```
