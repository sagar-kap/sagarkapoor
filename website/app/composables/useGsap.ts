import type { gsap as GsapType } from "gsap";

/**
 * Typed accessor for the GSAP instance provided by plugins/gsap.client.ts.
 * SplitText is not registered globally — import it where it is used.
 */
export const useGsap = () => {
  const { $gsap } = useNuxtApp() as unknown as {
    $gsap: typeof GsapType;
  };

  return { gsap: $gsap };
};
