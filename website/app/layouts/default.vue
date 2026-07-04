<template>
  <!-- overflow-x-clip: the contact bottle drifts to 115vw on cast (and split
       headlines can momentarily overshoot); clip keeps that off the page's
       horizontal scrollbar without creating a scroll container. -->
  <div class="relative flex min-h-screen flex-col overflow-x-clip">
    <!-- Keyboard users skip the nav on every page. Visually hidden until
         focused, then surfaces above the sticky header (z-50). -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:border focus:border-(--hairline) focus:bg-(--surface) focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-(--color)"
    >
      Skip to content
    </a>

    <!-- Atmosphere: vignette for depth, grain for analog warmth. Fixed, behind
         all content, never interactive. No particles (Weburz owns those). -->
    <div class="vignette-overlay" aria-hidden="true" />
    <div class="grain-overlay" aria-hidden="true" />

    <SiteHeader />

    <main id="main" class="relative z-10 flex-1" tabindex="-1">
      <slot />
    </main>

    <SiteFooter class="relative z-10" />
  </div>
</template>
