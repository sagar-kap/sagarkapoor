import { defineNuxtPlugin } from "#app";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Registers GSAP + the plugins the site uses (line-reveals, scroll-pinned
 * milestones) once, client-side. Under prefers-reduced-motion every tween still
 * lands on its final state but completes near-instantly — content appears, no
 * motion. Consume via useGsap().
 */
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(1000);
  }

  return {
    provide: {
      gsap,
      ScrollTrigger,
      SplitText,
      prefersReducedMotion,
    },
  };
});
