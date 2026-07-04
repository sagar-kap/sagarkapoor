<template>
  <div ref="stage" class="relative">
    <!-- The form -->
    <form
      v-show="state !== 'sent'"
      ref="formEl"
      class="space-y-5"
      novalidate
      @submit.prevent="onSubmit"
    >
      <!-- Honeypot: bots fill it, humans never see it. -->
      <input
        v-model="trap"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
        class="absolute -left-[9999px] h-0 w-0"
      />

      <div class="grid gap-5 sm:grid-cols-2">
        <label class="block">
          <span
            class="mb-2 block font-mono text-xs tracking-[0.15em] text-(--muted) uppercase"
          >
            Your name
          </span>
          <input
            v-model="name"
            type="text"
            required
            autocomplete="name"
            placeholder="Jane Cousteau"
            class="w-full rounded-md border border-(--hairline) bg-(--surface) px-4 py-3 text-(--color) placeholder:text-(--muted)/80 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40 focus:outline-none"
          />
        </label>

        <label class="block">
          <span
            class="mb-2 block font-mono text-xs tracking-[0.15em] text-(--muted) uppercase"
          >
            Your email
          </span>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full rounded-md border border-(--hairline) bg-(--surface) px-4 py-3 text-(--color) placeholder:text-(--muted)/80 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40 focus:outline-none"
          />
          <span
            v-if="fieldError === 'email'"
            class="mt-2 block font-mono text-xs tracking-[0.1em] text-coral-500 uppercase"
          >
            {{ errorMsg }}
          </span>
        </label>
      </div>

      <label class="block">
        <span
          class="mb-2 block font-mono text-xs tracking-[0.15em] text-(--muted) uppercase"
        >
          What's this about?
        </span>
        <input
          v-model="subject"
          type="text"
          placeholder="A project, a question, a hello"
          class="w-full rounded-md border border-(--hairline) bg-(--surface) px-4 py-3 text-(--color) placeholder:text-(--muted)/80 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40 focus:outline-none"
        />
      </label>

      <label class="block">
        <span
          class="mb-2 block font-mono text-xs tracking-[0.15em] text-(--muted) uppercase"
        >
          Your message
        </span>
        <div class="relative">
          <textarea
            v-model="message"
            required
            rows="6"
            placeholder="Tell me what you're building…"
            class="w-full resize-y rounded-md border border-(--hairline) bg-(--surface) px-4 py-3 font-mono text-[0.95rem] tracking-[0.02em] text-(--color) caret-coral-500 placeholder:text-(--muted)/80 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40 focus:outline-none"
          />
          <!-- Subtle typewriter cursor at rest. -->
          <span
            v-if="!message"
            class="pointer-events-none absolute bottom-3.5 left-4 hidden font-mono text-[0.95rem] text-coral-500 motion-safe:inline"
            aria-hidden="true"
          >
            <span class="caret">▍</span>
          </span>
        </div>
      </label>

      <!-- Cloudflare Turnstile. Renders only when a site key is configured. -->
      <NuxtTurnstile v-if="turnstileSiteKey" v-model="token" />

      <p
        v-if="fieldError === 'general'"
        class="font-mono text-xs tracking-[0.1em] text-coral-500 uppercase"
      >
        {{ errorMsg }}
      </p>

      <button
        type="submit"
        :disabled="state === 'sending'"
        class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-coral-500 px-8 py-4 font-mono text-sm font-semibold tracking-[0.15em] text-white uppercase transition-colors duration-200 hover:bg-coral-600 disabled:opacity-60 sm:w-auto"
      >
        <UIcon
          :name="
            state === 'sending' ? 'i-lucide-loader-circle' : 'i-lucide-send'
          "
          :class="['size-4', state === 'sending' && 'animate-spin']"
        />
        {{ state === "sending" ? "Casting…" : "Cast into the ocean" }}
      </button>
    </form>

    <!-- The bottle (drifts on success) -->
    <div
      ref="bottleEl"
      class="pointer-events-none absolute inset-0 flex items-center justify-center text-(--color)"
      style="opacity: 0"
      aria-hidden="true"
    >
      <BottleSvg class="h-48 w-auto" />
    </div>

    <!-- Success message -->
    <div
      v-show="state === 'sent'"
      ref="successEl"
      class="py-6"
      role="status"
      aria-live="polite"
    >
      <p class="font-display text-display-md font-semibold text-(--color)">
        Cast. I'll write back from the shore.
      </p>
      <NuxtLink
        v-if="latestPostSlug"
        :to="`/writing/${latestPostSlug}`"
        class="mt-5 inline-flex items-center gap-2 font-mono text-sm tracking-[0.12em] text-teal-500 uppercase transition-colors hover:text-coral-500"
      >
        Read something while you wait
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
type FormState = "idle" | "sending" | "sent";

withDefaults(
  defineProps<{
    /** Slug of the most recent post, for the "read while you wait" link. */
    latestPostSlug?: string;
  }>(),
  { latestPostSlug: "" },
);

const { gsap, prefersReducedMotion } = useGsap();
const runtimeConfig = useRuntimeConfig();
const turnstileSiteKey = computed(
  () =>
    (runtimeConfig.public.turnstile as { siteKey?: string } | undefined)
      ?.siteKey ?? "",
);

const state = ref<FormState>("idle");
const errorMsg = ref("");
const fieldError = ref<"" | "email" | "general">("");

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");
const token = ref("");
const trap = ref("");

const stage = ref<HTMLElement | null>(null);
const formEl = ref<HTMLElement | null>(null);
const bottleEl = ref<HTMLElement | null>(null);
const successEl = ref<HTMLElement | null>(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (field: "email" | "general", msg: string) => {
  fieldError.value = field;
  errorMsg.value = msg;
  shake();
};

const shake = () => {
  if (prefersReducedMotion || !formEl.value) return;
  gsap.fromTo(
    formEl.value,
    { x: 0 },
    {
      keyframes: { x: [-8, 8, -4, 0] },
      duration: 0.4,
      ease: "power2.out",
    },
  );
};

// The signature beat: roll the form shut, send the bottle off on the tide,
// then reveal the note. Reduced motion → straight cross-fade, no bottle.
const playCast = () => {
  if (prefersReducedMotion) {
    state.value = "sent";
    return;
  }

  const tl = gsap.timeline();

  // 1. The form rolls into itself like a scroll closing.
  tl.to(formEl.value, {
    scaleY: 0,
    transformOrigin: "top center",
    opacity: 0,
    duration: 0.5,
    ease: "power2.in",
  });

  // 2. Bottle materialises over the emptied form.
  tl.set(bottleEl.value, { opacity: 1, x: 0, y: 0, rotation: -4 });
  tl.from(bottleEl.value, {
    scale: 0.7,
    opacity: 0,
    duration: 0.4,
    ease: "back.out(1.6)",
    onStart: () => {
      // 3. Cork "thunk" — haptic on mobile only, no sound.
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(12);
      }
    },
  });

  // 4. Drift off to the right with a gentle sine bob (custom motion, not physics).
  tl.to(
    bottleEl.value,
    {
      x: "115vw",
      rotation: 6,
      duration: 2.5,
      ease: "power1.in",
    },
    "+=0.25",
  );
  tl.to(
    bottleEl.value,
    {
      y: "-=22",
      repeat: 4,
      yoyo: true,
      duration: 0.62,
      ease: "sine.inOut",
    },
    "<",
  );

  // 5. Reveal the note.
  tl.add(() => {
    state.value = "sent";
  });
  tl.from(
    successEl.value,
    { opacity: 0, y: 18, duration: 0.7, ease: "power3.out" },
    "+=0.05",
  );
};

const onSubmit = async () => {
  // Honeypot tripped → fake success, send nothing.
  if (trap.value) {
    state.value = "sent";
    return;
  }

  fieldError.value = "";
  errorMsg.value = "";

  if (!name.value.trim() || !message.value.trim()) {
    fail("general", "Name and message are both required.");
    return;
  }
  if (!EMAIL_RE.test(email.value.trim())) {
    fail("email", "That email doesn't look right.");
    return;
  }

  // Dev affordance: with no Turnstile configured locally, preview the cast
  // animation without hitting the API (which would reject the missing token).
  if (import.meta.dev && !turnstileSiteKey.value) {
    playCast();
    return;
  }

  state.value = "sending";
  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value,
        turnstileToken: token.value,
        website: trap.value,
      },
    });
    playCast();
  } catch (error) {
    state.value = "idle";
    const statusMessage = (error as { statusMessage?: string })?.statusMessage;
    fail("general", statusMessage || "Couldn't send — please try again.");
  }
};
</script>

<style scoped>
.caret {
  animation: caret-blink 1.1s steps(1) infinite;
}

@keyframes caret-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }
}
</style>
