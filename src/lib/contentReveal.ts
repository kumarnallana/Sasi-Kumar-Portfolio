import { gsap } from "gsap";

/** Call inside the section's gsap.context so unmount reverts the media/tween. */
export function revealContent(targets: gsap.TweenTarget, vars: gsap.TweenVars) {
  const media = gsap.matchMedia();
  media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    const motionVars = { ...vars };
    delete motionVars.opacity;
    if (motionVars.scrollTrigger && typeof motionVars.scrollTrigger === "object") {
      motionVars.scrollTrigger = { ...motionVars.scrollTrigger, once: true };
    }
    gsap.from(targets, { ...motionVars, immediateRender: false });
  });
}
