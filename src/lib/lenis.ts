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

function normalizeSectionId(id: string) {
  if (id === "architect" || id === "#architect") {
    return "profile";
  }
  return id.replace(/^#/, "");
}

export function scrollToSection(rawId: string) {
  if (document.body.style.overflow === "hidden") {
    return;
  }

  const id = normalizeSectionId(rawId);
  const target = id === "top" ? 0 : document.getElementById(id);

  if (target === null) {
    return;
  }

  const lenis = instance;

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
    duration: 0.9,
    easing: (t: number) => 1 - Math.pow(1 - t, 4),
  });
}
