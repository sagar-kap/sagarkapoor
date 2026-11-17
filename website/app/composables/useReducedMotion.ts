const QUERY = "(prefers-reduced-motion: reduce)";

// One shared, browser-only flag. The media query listener is attached on first
// use and lives for the page's lifetime, so a mid-session OS change is picked
// up everywhere. On the server it stays false (nothing reads it there).
const reducedMotion = ref(false);
let listening = false;

/**
 * Reactive `prefers-reduced-motion: reduce` flag, shared by the GSAP plugin,
 * useScrollReveal, WaveBack and BottleForm. Read `.value` at the moment you
 * animate, not once at setup.
 */
export const useReducedMotion = () => {
  if (import.meta.client && !listening) {
    listening = true;
    const query = window.matchMedia(QUERY);
    reducedMotion.value = query.matches;
    query.addEventListener("change", (event) => {
      reducedMotion.value = event.matches;
    });
  }

  return reducedMotion;
};
