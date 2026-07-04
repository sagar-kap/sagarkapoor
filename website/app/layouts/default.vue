<template>
  <!-- overflow-x-clip: the contact bottle drifts to 115vw on cast (and split
       headlines can momentarily overshoot); clip keeps that off the page's
       horizontal scrollbar without creating a scroll container. -->
  <div class="relative flex min-h-screen flex-col overflow-x-clip">
    <!-- Atmosphere: vignette for depth, grain for analog warmth. Fixed, behind
         all content, never interactive. No particles (Weburz owns those). -->
    <div class="vignette-overlay" aria-hidden="true" />
    <div class="grain-overlay" aria-hidden="true" />

    <SiteHeader />

    <main class="relative z-10 flex-1">
      <slot />
    </main>

    <SiteFooter class="relative z-10" />
  </div>
</template>
