import { defineNuxtPlugin } from "#app";
import { gsap } from "gsap";

/**
 * Provides GSAP once, client-side. Under prefers-reduced-motion every tween
 * still lands on its final state but completes near-instantly — content
 * appears, no motion. The timeline speed follows the preference live. Consume
 * via useGsap().
 */
export default defineNuxtPlugin(() => {
  const reducedMotion = useReducedMotion();

  watch(
    reducedMotion,
    (reduce) => gsap.globalTimeline.timeScale(reduce ? 1000 : 1),
    { immediate: true },
  );

  return {
    provide: {
      gsap,
    },
  };
});
