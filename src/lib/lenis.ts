import type Lenis from "lenis";

// Lenis is instantiated inside <SmoothScroll/>; we stash the instance here so
// navigation (e.g. the depth bar) can drive smooth-scroll from anywhere.
let instance: Lenis | null = null;
let requestId = 0;
let owner: "navigation" | "snap" | null = null;
let settledUntil = 0;

// Cover the final native scroll event and the existing 150ms snap debounce.
// This is only a completion guard; active movement is owned by its request.
const COMPLETION_GUARD_MS = 200;

export function setLenis(l: Lenis | null) {
  instance = l;
  requestId += 1;
  owner = null;
  settledUntil = 0;
}

export function getLenis() {
  return instance;
}

export function isScrollOwned() {
  // Lenis replaces userData when wheel/touch takes over, and resets scrolling
  // when stopped. Neither cancellation necessarily calls onComplete.
  if (owner && (!instance?.isScrolling || instance.userData.scrollRequest !== requestId)) {
    requestId += 1;
    owner = null;
  }
  return owner !== null || performance.now() < settledUntil;
}

function scrollWithOwner(target: HTMLElement | number, nextOwner: "navigation" | "snap") {
  const lenis = instance;
  if (!lenis || lenis.isStopped || document.body.style.overflow === "hidden") return;

  // Cancel a previous animation even if the new target is the current position.
  // Lenis otherwise treats an equal target as a no-op and leaves it running.
  if (lenis.isScrolling) {
    lenis.stop();
    lenis.start();
  }
  const request = ++requestId;
  owner = nextOwner;
  settledUntil = 0;
  lenis.scrollTo(target, {
    offset: 0,
    duration: nextOwner === "navigation" ? 1.2 : 0.7,
    ...(nextOwner === "snap" ? { easing: (t: number) => 1 - Math.pow(1 - t, 3) } : {}),
    userData: { scrollRequest: request },
    onComplete: () => {
      if (request !== requestId) return;
      owner = null;
      settledUntil = performance.now() + COMPLETION_GUARD_MS;
    },
  });
}

export function snapToPosition(top: number) {
  if (!isScrollOwned()) scrollWithOwner(top, "snap");
}

export function scrollToSection(id: string) {
  let target = id;
  if (target === "architect" || target === "#architect") {
    target = "profile";
  }
  const isTop = target === "top" || target === "#top";
  if (document.body.style.overflow === "hidden") return;
  const sel = target.startsWith("#") ? target : `#${target}`;
  const el = isTop ? null : document.querySelector<HTMLElement>(sel);
  if (!isTop && !el) return;
  const destination = isTop ? 0 : el!;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduce) {
    scrollWithOwner(destination, "navigation");
  } else {
    // Immediate fallback also works before Lenis initializes, and does not
    // defer to a CSS scroll-behavior rule for reduced-motion users.
    if (instance?.isStopped) return;
    requestId += 1;
    owner = null;
    settledUntil = performance.now() + COMPLETION_GUARD_MS;
    if (instance) instance.scrollTo(destination, { immediate: true });
    else if (isTop) window.scrollTo({ top: 0, behavior: "instant" });
    else el!.scrollIntoView({ behavior: "instant", block: "start" });
  }
}
