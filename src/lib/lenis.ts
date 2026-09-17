import type Lenis from "lenis";

// Lenis is instantiated inside <SmoothScroll/>; navigation can reuse that
// single desktop scroll owner without adding behavior to normal page scrolling.
let instance: Lenis | null = null;
let navigationRequest = 0;

export function setLenis(next: Lenis | null) {
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

  navigationRequest += 1;

  if (instance && !reduce) {
    // Lenis handles programmatic interruptions natively when lock is false.
    // No need for a custom cancellation state machine or force-scrolling on interrupt.
    instance.scrollTo(target, {
      offset: 0,
      duration: 1.2,
      lock: false,
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
  };

  const tryFinish = () => {
    if (request !== navigationRequest) {
      cleanup();
      return true;
    }

    const section = document.getElementById(id);
    if (!section || section.dataset.deferredPlaceholder === "true") return false;

    cleanup();
    moveToTarget(section, reduce);
    return true;
  };

  if (tryFinish()) return;

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
