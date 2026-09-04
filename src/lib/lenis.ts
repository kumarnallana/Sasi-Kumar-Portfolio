import type Lenis from "lenis";

// Lenis is instantiated inside <SmoothScroll/>; we stash the instance here so
// navigation (e.g. the depth bar) can drive smooth-scroll from anywhere.
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

export function scrollToSection(id: string) {
  let target = id;
  if (target === "architect" || target === "#architect") {
    target = "profile";
  }
  const sel = target.startsWith("#") ? target : `#${target}`;
  if (instance) {
    const el = document.querySelector(sel);
    if (el) {
      instance.scrollTo(el as HTMLElement, { offset: 0, duration: 1.2 });
    }
  } else {
    document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
  }
}
