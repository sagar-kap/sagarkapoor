<template>
  <article v-if="post" class="px-6 pt-12 pb-24 md:pt-20 md:pb-32">
    <!-- Hero -->
    <header class="mx-auto max-w-[44rem]">
      <NuxtLink
        to="/writing"
        class="-my-1.5 inline-flex items-center gap-2 py-1.5 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase transition-colors hover:text-(--accent)"
      >
        <UIcon name="i-lucide-arrow-left" class="size-3.5" />
        Writing
      </NuxtLink>

      <h1
        class="mt-6 font-serif text-display-lg leading-tight text-balance text-(--color)"
      >
        {{ post.title }}
      </h1>

      <div
        class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase"
      >
        <span v-if="post.date">{{ formatDate(post.date) }}</span>
        <span v-if="readLabel" aria-hidden="true">·</span>
        <span v-if="readLabel">{{ readLabel }}</span>
        <template v-if="post.updated">
          <span aria-hidden="true">·</span>
          <span>Updated {{ formatDate(post.updated) }}</span>
        </template>
      </div>
    </header>

    <LazySweepReplay
      v-if="post.slug === 'reading-a-sweep'"
      class="mx-auto mt-8 max-w-[44rem]"
    />

    <!-- Body. Markdown is first-party (these files live in the repo) and is
         rendered to HTML at build time by marked. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="prose-ocean mx-auto mt-12 max-w-[44rem]" v-html="post.html" />

    <!-- Byline -->
    <footer class="mx-auto mt-16 max-w-[44rem]">
      <img
        src="/scenes/desk-lit.png"
        alt=""
        width="240"
        height="78"
        loading="lazy"
        class="w-36 rounded-sm [image-rendering:pixelated]"
      />
      <div class="mt-10 flex items-start gap-4">
        <UAvatar
          src="https://github.com/Sagar-Kap.png"
          :alt="identity.name"
          size="lg"
        />
        <div>
          <p class="font-display font-semibold text-(--color)">
            Written by {{ identity.name }}
          </p>
          <p class="mt-1 max-w-md text-sm text-(--muted)">
            {{ identity.bio }}
            <!-- Underlined on purpose: it sits inside a muted paragraph, so
                 colour alone doesn't distinguish it (WCAG 1.4.1). -->
            <NuxtLink
              to="/about"
              class="text-(--accent) underline decoration-(--label)/60 underline-offset-[3px] transition-colors hover:text-(--accent-hover)"
            >
              More about me →
            </NuxtLink>
          </p>
        </div>
      </div>
    </footer>

    <!-- Neighbours -->
    <div class="mx-auto mt-16 max-w-[44rem]">
      <Divider />
      <PostNav
        class="mt-10"
        :previous="neighbours.previous"
        :next="neighbours.next"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { identity } from "../../data/site";
import type { WritingPostDocument } from "#shared/utils/writing";

const route = useRoute();
const { formatDate } = useFormattedDate();
const { formatReadTime } = useFormattedReadTime();

const slug = route.params.slug as string;

// Rendered HTML comes from the prerendered /api/writing/<slug>.json (server/api/
// writing) — the markdown pipeline never runs in the browser. Cached for the
// session for the same reason as the index (see useWritingIndex).
const { data } = await useFetch(`/api/writing/${slug}.json`, {
  transform: ({ data: { id, attributes }, meta }: WritingPostDocument) => ({
    post: { slug: id, ...attributes },
    neighbours: meta,
  }),
  getCachedData: (key, nuxtApp) =>
    nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
});

const post = data.value?.post;
const neighbours = data.value?.neighbours ?? { previous: null, next: null };

if (!post) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

const readLabel = computed(() => formatReadTime({ minutes: post.readMinutes }));

useSeoMeta({
  title: post.title,
  description: post.excerpt,
  ogType: "article",
  articlePublishedTime: post.date,
  articleModifiedTime: post.updated,
});

useSchemaOrg([
  defineArticle({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated,
  }),
]);
</script>

<style scoped>
/* Long-form reading measure: ~64ch, generous leading, JetBrains Mono for code.
   Targets the server-rendered markdown HTML. */
.prose-ocean {
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--color);
}

.prose-ocean :deep(p),
.prose-ocean :deep(ul),
.prose-ocean :deep(ol),
.prose-ocean :deep(blockquote) {
  margin-block: 1.4em;
}

.prose-ocean :deep(h2) {
  margin-block: 2em 0.6em;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.prose-ocean :deep(h3) {
  margin-block: 1.6em 0.5em;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
}

.prose-ocean :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: color-mix(in oklch, var(--label), transparent 40%);
  text-underline-offset: 3px;
}

.prose-ocean :deep(a:hover) {
  color: var(--accent-hover);
}

.prose-ocean :deep(ul),
.prose-ocean :deep(ol) {
  padding-inline-start: 1.4em;
}

.prose-ocean :deep(ul) {
  list-style: disc;
}

.prose-ocean :deep(ol) {
  list-style: decimal;
}

.prose-ocean :deep(li) {
  margin-block: 0.4em;
}

.prose-ocean :deep(blockquote) {
  border-inline-start: 2px solid var(--label);
  padding-inline-start: 1.2em;
  font-style: italic;
  color: var(--muted);
}

.prose-ocean :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: color-mix(in oklch, currentColor, transparent 92%);
  padding: 0.15em 0.4em;
  border-radius: 0.25rem;
}

.prose-ocean :deep(pre) {
  margin-block: 1.6em;
  overflow-x: auto;
  border: 1px solid var(--hairline);
  border-radius: 0.75rem;
  background: var(--surface);
  padding: 1.1rem 1.25rem;
}

/* Code blocks are focusable (see withFocusableCodeBlocks) so they can be
   scrolled by keyboard — which only helps if the focus is visible. */
.prose-ocean :deep(pre:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.prose-ocean :deep(pre code) {
  background: transparent;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

/* Syntax highlighting (server/utils/highlight.ts). Shiki emits both themes as
   CSS variables on every token; the colour-mode class on <html> picks one, so
   the markup is the same in both modes. Its own background is ignored — the
   <pre> keeps the site surface. */
.prose-ocean :deep(.shiki),
.prose-ocean :deep(.shiki span) {
  color: var(--shiki-light);
}

.dark .prose-ocean :deep(.shiki),
.dark .prose-ocean :deep(.shiki span) {
  color: var(--shiki-dark);
}

/* Heading anchors: a "#" link after h2/h3 text. Always present for keyboard
   and touch; on hover-capable devices it fades in with the heading. */
.prose-ocean :deep(h2),
.prose-ocean :deep(h3) {
  scroll-margin-top: 6rem;
}

.prose-ocean :deep(.heading-anchor) {
  margin-inline-start: 0.35em;
  font-family: var(--font-mono);
  font-size: 0.8em;
  font-weight: 400;
  text-decoration: none;
  color: var(--muted);
}

.prose-ocean :deep(.heading-anchor:hover),
.prose-ocean :deep(.heading-anchor:focus-visible) {
  color: var(--accent);
}

.prose-ocean :deep(.heading-anchor:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 0.125rem;
}

@media (hover: hover) {
  .prose-ocean :deep(.heading-anchor) {
    opacity: 0;
    transition: opacity 0.15s;
  }

  .prose-ocean :deep(h2:hover .heading-anchor),
  .prose-ocean :deep(h3:hover .heading-anchor),
  .prose-ocean :deep(.heading-anchor:focus-visible) {
    opacity: 1;
  }
}

.prose-ocean :deep(img) {
  max-width: 100%;
  height: auto;
  margin-block: 1.8em;
  border-radius: 0.75rem;
}

.prose-ocean :deep(hr) {
  margin-block: 2.5em;
  border: 0;
  border-top: 1px solid var(--hairline);
}
</style>
