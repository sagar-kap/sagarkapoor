<template>
  <footer>
    <!-- The shore: a tide rolls in just above the footer, swelling with the real
         spring/neap strength of tonight's moon. "I'll write back from the shore." -->
    <TideLine height="6rem" :strength="swell" />

    <div class="border-t border-(--hairline)">
      <div
        class="mx-auto flex max-w-[72rem] flex-col items-center gap-5 px-6 py-10 sm:flex-row sm:justify-between"
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

// Single bare year — no formatter needed.
const year = new Date().getFullYear();

// Real spring/neap swell from the moon. Start at the neutral default (matches
// the tide's SSR render) and settle to tonight's true value once mounted, so
// the waves visibly ease into spring or neap on load — no hydration mismatch.
const { tideStrength } = useMoon();
const swell = ref(0.6);
onMounted(() => {
  swell.value = tideStrength.value;
});
watch(tideStrength, (value) => {
  swell.value = value;
});
</script>
