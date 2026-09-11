import { gsap } from "gsap";

/** Call inside the section's gsap.context so unmount reverts the media/tween. */
export function revealContent(targets: gsap.TweenTarget, vars: gsap.TweenVars) {
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    // Keep the rendered content readable while waiting for a scroll trigger.
    // A missed/stale trigger must never leave an eagerly applied opacity: 0.
    gsap.from(targets, { ...vars, immediateRender: false });
  });
}
