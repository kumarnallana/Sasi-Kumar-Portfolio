import Lenis from "lenis";

// Lenis is instantiated inside <SmoothScroll/>; navigation can reuse that
// single desktop scroll owner without adding behavior to normal page scrolling.
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

type ScrollToSectionOptions = {
  updateHash?: boolean;
};

const premiumEase = (t: number) => 1 - Math.pow(1 - t, 4);

function navigationDuration(targetY: number, currentY: number) {
  const distance = Math.abs(targetY - currentY);
  return Math.min(1.25, Math.max(0.7, 0.7 + distance / 5500));
}

function normalizeSectionId(id: string) {
  if (id === "architect" || id === "#architect") {
    return "profile";
  }
  return id.replace(/^#/, "");
}

export function scrollToSection(
  rawId: string,
  { updateHash = false }: ScrollToSectionOptions = {},
) {
  if (document.body.style.overflow === "hidden") {
    return;
  }

  const id = normalizeSectionId(rawId);
  const target = id === "top" ? 0 : document.getElementById(id);

  if (target === null) {
    return;
  }

  if (updateHash) {
    const nextUrl = id === "top"
      ? `${window.location.pathname}${window.location.search}`
      : `#${id}`;
    if (window.location.hash !== (id === "top" ? "" : nextUrl)) {
      window.history.pushState(null, "", nextUrl);
    }
  }

  const targetY = typeof target === "number"
    ? target
    : window.scrollY + target.getBoundingClientRect().top;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const lenis = instance;

  if (lenis && !lenis.isStopped && reduceMotion) {
    // Cancel any journey already running when the motion preference changes.
    lenis.scrollTo(target, { immediate: true });
    return;
  }

  if (!lenis || lenis.isStopped) {
    if (typeof target === "number") {
      window.scrollTo({
        top: target,
        behavior: "instant",
      });
    } else {
      target.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
    return;
  }

  lenis.scrollTo(target, {
    offset: 0,
    lock: false,
    // This applies only to explicit navigation clicks.
    // Normal wheel scrolling still uses the global lerp behavior.
    duration: navigationDuration(targetY, lenis.animatedScroll),
    easing: premiumEase,
    userData: { source: "section-navigation", target: id },
  });
}
