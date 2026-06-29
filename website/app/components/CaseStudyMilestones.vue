<template>
  <section ref="el" class="relative" aria-label="Project milestones">
    <div
      ref="viewport"
      class="lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden"
    >
      <div class="mx-auto w-full max-w-[64rem] px-6 pt-16 lg:pt-0 lg:pb-10">
        <span
          class="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-(--muted) uppercase"
        >
          <span class="h-px w-8 bg-burz-yellow-500" aria-hidden="true" />
          How it went
        </span>
      </div>

      <!-- The walk: a vertical card stack on mobile / reduced motion, swept
           horizontally by the scroll-pin on large screens (see script). -->
      <ol
        ref="track"
        class="flex flex-col gap-6 px-6 pb-16 lg:flex-row lg:flex-nowrap lg:gap-8 lg:pb-0 lg:pl-[max(1.5rem,calc((100vw-64rem)/2))] lg:pr-[20vw]"
      >
        <li
          v-for="milestone in milestones"
          :key="milestone.label"
          class="flex flex-col rounded-xl border border-(--hairline) bg-(--surface) p-8 lg:min-h-[20rem] lg:w-[min(80vw,32rem)] lg:shrink-0 lg:justify-center lg:p-10"
        >
          <span
            class="font-mono text-xs tracking-[0.22em] text-burz-yellow-500"
          >
            {{ milestone.label }} / {{ total }}
          </span>
          <h3
            class="mt-4 font-display text-2xl font-semibold text-(--color) lg:text-3xl"
          >
            {{ milestone.title }}
          </h3>
          <p class="mt-3 max-w-md text-(--muted) lg:text-lg">
            {{ milestone.body }}
          </p>
        </li>
      </ol>

      <!-- Scroll progress — desktop, motion only; harmless if it never fills. -->
      <div
        aria-hidden="true"
        class="mx-auto hidden h-px w-full max-w-[64rem] bg-(--hairline) px-6 lg:block"
      >
        <span
          ref="progress"
          class="block h-px origin-left scale-x-0 bg-burz-yellow-500"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Milestone } from "../data/work";

const props = defineProps<{ milestones: Milestone[] }>();

// Mono denominator for the "01 / 04" step labels.
const total = computed(() => String(props.milestones.length).padStart(2, "0"));

const { gsap } = useGsap();

const el = ref<HTMLElement | null>(null);
const viewport = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const progress = ref<HTMLElement | null>(null);

let mm: ReturnType<typeof gsap.matchMedia> | null = null;

onMounted(() => {
  // Horizontal scroll-pin only on large screens with motion allowed; mobile and
  // reduced-motion users keep the static vertical card stack. matchMedia handles
  // setup, teardown, and re-runs across the breakpoint for us.
  mm = gsap.matchMedia();

  mm.add(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    () => {
      const trackEl = track.value;
      const viewportEl = viewport.value;
      if (!trackEl || !viewportEl) return;

      // Distance the track must travel so its last panel lands in view.
      const distance = () =>
        Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth);
      if (distance() === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el.value,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(trackEl, { x: () => -distance(), ease: "none" }, 0);
      if (progress.value) {
        tl.to(progress.value, { scaleX: 1, ease: "none" }, 0);
      }
    },
  );
});

onUnmounted(() => mm?.revert());
</script>
