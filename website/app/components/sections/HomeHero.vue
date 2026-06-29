<template>
  <section class="relative overflow-hidden">
    <div class="mx-auto max-w-[72rem] px-6 pt-24 pb-20 md:pt-36 md:pb-28">
      <p
        ref="eyebrowRef"
        class="font-mono text-xs tracking-[0.25em] text-(--muted) uppercase"
      >
        {{ identity.role }} · {{ identity.city }}
      </p>

      <h1
        ref="headlineRef"
        class="mt-6 max-w-4xl font-display text-display-xl text-balance text-(--color)"
      >
        I'm Sagar. I run Weburz, a studio that builds software for the web.
      </h1>

      <p ref="subRef" class="mt-7 max-w-xl text-lg text-(--muted) md:text-xl">
        Founded in {{ identity.foundedYear }}, based in {{ identity.city }}.
        Sometimes I make games.
      </p>

      <div ref="ctaRef" class="mt-10 flex flex-wrap items-center gap-3">
        <UButton
          to="/work"
          label="See what we build"
          trailing-icon="i-lucide-arrow-right"
          color="primary"
          size="xl"
        />
        <NuxtLink
          to="/writing"
          class="group inline-flex items-center gap-2 px-2 py-3 font-mono text-sm tracking-[0.12em] text-(--color) uppercase"
        >
          <span
            class="border-b-2 border-transparent pb-0.5 transition-colors group-hover:border-burz-yellow-500"
          >
            Read what I write
          </span>
          <UIcon name="i-lucide-arrow-up-right" class="size-4 text-(--muted)" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { identity } from "../../data/site";

const { gsap, SplitText, prefersReducedMotion } = useGsap();

const eyebrowRef = ref<HTMLElement | null>(null);
const headlineRef = ref<HTMLElement | null>(null);
const subRef = ref<HTMLElement | null>(null);
const ctaRef = ref<HTMLElement | null>(null);

let ctx: ReturnType<typeof gsap.context> | null = null;

onMounted(() => {
  if (prefersReducedMotion) return;

  ctx = gsap.context(() => {
    // Line-by-line clip reveal on the headline (the Weburz signature move),
    // with the eyebrow, sub, and CTAs drifting up after it.
    const split = new SplitText(headlineRef.value, { type: "lines" });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(eyebrowRef.value, { autoAlpha: 0, y: 12, duration: 0.6 })
      .from(
        split.lines,
        {
          clipPath: "inset(100% 0 0 0)",
          yPercent: 8,
          duration: 0.9,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.2",
      )
      .from(subRef.value, { autoAlpha: 0, y: 16, duration: 0.7 }, "-=0.5")
      .from(ctaRef.value, { autoAlpha: 0, y: 16, duration: 0.7 }, "-=0.5");
  });
});

onUnmounted(() => ctx?.revert());
</script>
