/**
 * Lightweight scroll-reveal — adds an `is-revealed` class the first time the
 * target enters the viewport, letting CSS handle the transition. No animation
 * library; respects prefers-reduced-motion by revealing immediately.
 *
 * Pair with the `reveal` utility classes in main.css's components layer.
 */
export const useScrollReveal = (target: Ref<HTMLElement | null>) => {
  onMounted(() => {
    const el = target.value;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      el.classList.add("is-revealed");
      return;
    }

    // threshold 0 (fire on first pixel), NOT 0.1 — a tall element can never
    // show 10% of itself at once on mobile, so 0.1 would never fire and the
    // section would stay invisible. rootMargin nudges the trigger into view.
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 },
    );

    observer.observe(el);
    onUnmounted(() => observer.disconnect());
  });
};
