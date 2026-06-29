import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextType } from "gsap/SplitText";

/**
 * Typed accessor for the GSAP instance provided by plugins/gsap.client.ts.
 * Returns the registered `gsap`, `ScrollTrigger`, `SplitText`, and the resolved
 * `prefersReducedMotion` flag so callers can early-return from their timelines.
 */
export const useGsap = () => {
  const { $gsap, $ScrollTrigger, $SplitText, $prefersReducedMotion } =
    useNuxtApp() as unknown as {
      $gsap: typeof GsapType;
      $ScrollTrigger: typeof ScrollTriggerType;
      $SplitText: typeof SplitTextType;
      $prefersReducedMotion: boolean;
    };

  return {
    gsap: $gsap,
    ScrollTrigger: $ScrollTrigger,
    SplitText: $SplitText,
    prefersReducedMotion: $prefersReducedMotion,
  };
};
