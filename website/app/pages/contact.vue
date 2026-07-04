<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <!-- Hook -->
      <div ref="hook" class="reveal">
        <span
          class="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-(--muted) uppercase"
        >
          <span class="h-px w-8 bg-burz-yellow-500" aria-hidden="true" />
          Contact
        </span>
        <h1
          class="mt-4 max-w-lg font-display text-display-lg font-semibold text-balance text-(--color)"
        >
          Throw a message in the ocean. I check the tide most mornings.
        </h1>

        <ul class="mt-10 space-y-3">
          <li
            v-for="badge in badges"
            :key="badge"
            class="flex items-center gap-3 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase"
          >
            <UIcon
              name="i-lucide-check"
              class="size-4 shrink-0 text-teal-500"
            />
            {{ badge }}
          </li>
        </ul>

        <!-- Live tide report, driven by the actual Moon (no API — it really
             does set spring vs neap, and its transit really is high water on
             this meridian). The daily tide leads; spring/neap sits in the
             title. -->
        <ClientOnly>
          <p
            class="mt-8 inline-flex items-center gap-2 rounded-full border border-(--hairline) px-3 py-1.5 font-mono text-xs tracking-[0.1em] text-(--muted) lowercase"
            :title="`Moon ${illuminationPct}% lit · ${tideLabel}`"
          >
            <span aria-hidden="true">{{ emoji }}</span>
            {{ phaseName }} · {{ tideReport }} · {{ time }} in sofia
          </p>
        </ClientOnly>
      </div>

      <!-- The signature interaction -->
      <div>
        <BottleForm :latest-post-slug="latestPostSlug" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Contact",
  description:
    "Throw a message in the ocean — a private contact form, no public inbox. I respond in 1-3 days.",
});

const { time } = useLocalTime();
const { emoji, phaseName, tideLabel, illuminationPct, tideReport } = useMoon();

const badges = [
  "Responds in 1-3 days",
  "No noreply replies",
  "No newsletter subscription",
];

const { posts } = useWritingPosts({ limit: 1 });
const latestPostSlug = computed(() => posts.value[0]?.slug ?? "");

const hook = ref<HTMLElement | null>(null);
useScrollReveal(hook);
</script>
