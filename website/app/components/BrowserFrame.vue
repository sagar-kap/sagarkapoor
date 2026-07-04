<template>
  <div
    class="overflow-hidden rounded-lg border border-(--hairline) bg-(--background)"
  >
    <div
      class="flex items-center gap-1.5 border-b border-(--hairline) px-3 py-2"
    >
      <span class="size-2.5 rounded-full bg-coral-400" />
      <span class="size-2.5 rounded-full bg-burz-yellow-400" />
      <span class="size-2.5 rounded-full bg-teal-400" />
    </div>

    <!-- Default: an abstract skeleton of the project's actual shape — an
         article page, a dark stage, a phone-first funnel — so the cards read
         as three different products, not three copies of one gradient. Pass a
         #default slot to drop in a real screenshot instead. -->
    <slot>
      <div
        class="relative aspect-[16/10] bg-gradient-to-br from-teal-500/10 via-transparent to-burz-yellow-500/10"
        aria-hidden="true"
      >
        <!-- article: a long-form reading column (title, prose, pull rule). -->
        <div
          v-if="visual === 'article'"
          class="absolute inset-0 flex flex-col items-center gap-[6%] px-[18%] pt-[12%]"
        >
          <div class="h-[9%] w-3/4 rounded-sm bg-(--color)/25" />
          <div class="h-px w-1/4 bg-burz-yellow-500/60" />
          <div class="flex w-full flex-col gap-[4.5%] self-stretch">
            <div class="h-[4%] min-h-1 w-full rounded-sm bg-(--color)/12" />
            <div class="h-[4%] min-h-1 w-11/12 rounded-sm bg-(--color)/12" />
            <div class="h-[4%] min-h-1 w-full rounded-sm bg-(--color)/12" />
            <div class="h-[4%] min-h-1 w-2/3 rounded-sm bg-(--color)/12" />
          </div>
        </div>

        <!-- stage: a dark player — artwork square, progress, track list. -->
        <div
          v-else-if="visual === 'stage'"
          class="absolute inset-0 bg-black/50"
        >
          <div
            class="absolute top-[14%] left-[10%] size-[30%] rounded-sm bg-coral-500/70"
          />
          <div
            class="absolute top-[20%] left-[48%] h-[7%] w-[38%] rounded-sm bg-white/20"
          />
          <div
            class="absolute top-[34%] left-[48%] h-[5%] w-[26%] rounded-sm bg-white/10"
          />
          <div
            class="absolute top-[58%] left-[10%] h-[3%] w-[80%] rounded-full bg-white/10"
          />
          <div
            class="absolute top-[58%] left-[10%] h-[3%] w-[34%] rounded-full bg-burz-yellow-500/70"
          />
          <div
            class="absolute top-[72%] left-[10%] h-[5%] w-[60%] rounded-sm bg-white/10"
          />
          <div
            class="absolute top-[84%] left-[10%] h-[5%] w-[48%] rounded-sm bg-white/10"
          />
        </div>

        <!-- mobile: a centered phone with an easy thumb-reach sign-up. -->
        <div
          v-else-if="visual === 'mobile'"
          class="absolute inset-0 flex items-end justify-center"
        >
          <div
            class="flex h-[86%] w-[34%] flex-col gap-[5%] rounded-t-lg border border-b-0 border-(--color)/20 bg-(--surface) p-[3%]"
          >
            <div class="h-[30%] w-full rounded-sm bg-teal-500/25" />
            <div class="h-[6%] w-4/5 rounded-sm bg-(--color)/20" />
            <div class="h-[6%] w-3/5 rounded-sm bg-(--color)/12" />
            <div
              class="mt-auto mb-[4%] h-[12%] w-full rounded-md bg-teal-500/80"
            />
          </div>
        </div>

        <span
          class="absolute bottom-[6%] left-[6%] font-mono text-[0.6rem] tracking-[0.2em] text-(--muted) uppercase"
        >
          {{ label }}
        </span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  /** Abstract placeholder shape; matches CaseStudy.visual. */
  visual?: "article" | "stage" | "mobile";
}>();
</script>
