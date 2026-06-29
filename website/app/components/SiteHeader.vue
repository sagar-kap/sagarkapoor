<template>
  <header
    class="sticky top-0 z-50 border-b border-(--hairline) backdrop-blur-md"
    :style="{ backgroundColor: 'var(--nav-background)' }"
  >
    <div
      class="mx-auto flex h-16 max-w-[72rem] items-center justify-between px-6"
    >
      <!-- Wordmark: full name on desktop, the flickering SK monogram on mobile. -->
      <NuxtLink
        to="/"
        class="group flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-(--color)"
        aria-label="Sagar Kapoor — home"
      >
        <span class="hidden sm:inline">{{ identity.name }}</span>
        <span class="flicker font-mono text-xl font-bold sm:hidden">{{
          identity.monogram
        }}</span>
        <!-- Live "is Sagar around?" pulse. -->
        <ClientOnly>
          <span
            class="relative flex size-2"
            :title="isAwake ? 'Sagar is probably around' : 'Sagar is asleep'"
          >
            <span
              v-if="isAwake"
              class="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-60 motion-reduce:hidden"
            />
            <span
              class="relative inline-flex size-2 rounded-full"
              :class="isAwake ? 'bg-teal-400' : 'bg-(--muted)'"
            />
          </span>
        </ClientOnly>
      </NuxtLink>

      <div class="flex items-center gap-1">
        <!-- Desktop nav -->
        <nav class="hidden items-center gap-1 md:flex">
          <UButton
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :label="link.label"
            color="neutral"
            variant="ghost"
            class="font-mono text-xs tracking-[0.18em] uppercase"
            active-class="text-(--color)"
            inactive-class="text-(--muted)"
          />
          <ColorModeToggle class="ml-1" />
        </nav>

        <!-- Mobile: toggle + menu -->
        <div class="flex items-center gap-1 md:hidden">
          <ColorModeToggle />
          <UButton
            :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
            :aria-label="open ? 'Close menu' : 'Open menu'"
            :aria-expanded="open"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="open = !open"
          />
        </div>
      </div>
    </div>

    <!-- Mobile menu panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav
        v-if="open"
        class="border-t border-(--hairline) md:hidden"
        :style="{ backgroundColor: 'var(--nav-background)' }"
      >
        <ul class="mx-auto max-w-[72rem] px-6 py-4">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="block py-3 font-mono text-sm tracking-[0.18em] text-(--muted) uppercase transition-colors hover:text-(--color)"
              active-class="!text-(--color)"
              @click="open = false"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { identity, navLinks } from "../data/site";

const { isAwake } = useLocalTime();

const open = ref(false);

// Close the mobile menu on route change.
const route = useRoute();
watch(
  () => route.path,
  () => {
    open.value = false;
  },
);
</script>
