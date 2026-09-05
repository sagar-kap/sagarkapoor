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
          <PresenceDot
            :is-awake="isAwake"
            :title="isAwake ? 'Sagar is probably around' : 'Sagar is asleep'"
          />
        </ClientOnly>
      </NuxtLink>

      <div class="flex items-center gap-1">
        <!-- Desktop nav -->
        <nav aria-label="Primary" class="hidden items-center gap-1 md:flex">
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
            ref="menuToggle"
            :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
            :aria-label="open ? 'Close menu' : 'Open menu'"
            :aria-expanded="open"
            aria-controls="mobile-nav"
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
        id="mobile-nav"
        aria-label="Primary (mobile)"
        class="border-t border-(--hairline) md:hidden"
        :style="{ backgroundColor: 'var(--nav-background)' }"
      >
        <ul class="mx-auto max-w-[72rem] px-6 py-4">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="block py-3 font-mono text-sm tracking-[0.18em] text-(--muted) uppercase transition-colors hover:text-(--color)"
              active-class="!text-(--color)"
              @click="closeMenu()"
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
const menuToggle = ref<{ $el?: HTMLElement } | null>(null);

// Escape closes the menu and hands focus back to the button that opened it,
// so a keyboard user isn't stranded on a panel that just disappeared.
const closeMenu = ({ restoreFocus = false } = {}) => {
  open.value = false;
  if (restoreFocus) nextTick(() => menuToggle.value?.$el?.focus());
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeMenu({ restoreFocus: true });
};

// Listen only while the menu is open — no idle global handler.
watch(open, (isOpen) => {
  if (isOpen) window.addEventListener("keydown", onKeydown);
  else window.removeEventListener("keydown", onKeydown);
});

onUnmounted(() => window.removeEventListener("keydown", onKeydown));

// Close the mobile menu on route change.
const route = useRoute();
watch(
  () => route.path,
  () => closeMenu(),
);
</script>
