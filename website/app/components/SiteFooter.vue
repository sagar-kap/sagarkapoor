<template>
  <footer>
    <!-- The shore: a tide rolls in just above the footer — swelling with the
         real spring/neap strength of tonight's moon, and riding at the real
         water level of the Moon's tide over Sofia's meridian. High water on
         the site is high water outside. "I'll write back from the shore."
         Pulled up into the last section's bottom padding — every page ends with
         >=6rem of it, so the sea laps at that dead band instead of adding to it. -->
    <TideLine
      height="6rem"
      class="-mt-10 md:-mt-14"
      :strength="swell"
      :level="level"
    />

    <div class="border-t border-(--hairline)">
      <div
        class="mx-auto flex max-w-[72rem] flex-col items-center gap-5 px-6 py-8 sm:flex-row sm:justify-between"
      >
        <div class="flex flex-col items-center gap-2 sm:items-start">
          <p class="font-mono text-xs tracking-[0.12em] text-(--muted)">
            © {{ year }} {{ identity.name }} · Built in public on Cloudflare
          </p>
          <LocalTime />
        </div>

        <div class="flex items-center gap-1">
          <UButton
            v-for="social in socialLinks"
            :key="social.href"
            :to="social.href"
            :icon="social.icon"
            :aria-label="social.label"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="ghost"
            size="sm"
          />
          <WaveBack />
          <ColorModeToggle />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { identity, socialLinks } from "../data/site";

// Single bare year — no formatter needed. The homepage is prerendered, so a
// bare const would freeze at build time; settle it on mount so the copyright
// can't read last year's bake in January.
const year = ref(new Date().getFullYear());
onMounted(() => {
  year.value = new Date().getFullYear();
});

// Real spring/neap swell + real water level from the moon. Start at the
// neutral defaults (matching the tide's SSR render) and settle to the true
// values once mounted, so the sea visibly eases into its actual state on
// load — no hydration mismatch. useMoon ticks, so the watchers keep the
// waterline live through a long session.
const { tideStrength, waterLevel } = useMoon();
const swell = ref(0.6);
const level = ref(0.5);
onMounted(() => {
  swell.value = tideStrength.value;
  level.value = waterLevel.value;
});
watch(tideStrength, (value) => {
  swell.value = value;
});
watch(waterLevel, (value) => {
  level.value = value;
});
</script>
