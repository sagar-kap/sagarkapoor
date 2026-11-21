<template>
  <div class="relative">
    <!-- The form -->
    <form
      v-show="state !== 'sent'"
      ref="formEl"
      class="space-y-5"
      novalidate
      @submit.prevent="emit('submit')"
    >
      <!-- Honeypot: bots fill it, humans never see it. Deliberately not named
           like anything autofill recognises (website, url, company…). -->
      <input
        v-model="cork"
        type="text"
        name="cork"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
        class="absolute -left-[9999px] h-0 w-0"
      />

      <div class="grid gap-5 sm:grid-cols-2">
        <label class="block">
          <span :class="LABEL_CLASS"> Your name </span>
          <input
            ref="nameInput"
            v-model="name"
            type="text"
            required
            :maxlength="MAX.name"
            autocomplete="name"
            placeholder="Jane Cousteau"
            :aria-invalid="
              (fieldError === 'general' && !name.trim()) || undefined
            "
            :class="FIELD_CLASS"
          />
        </label>

        <label class="block">
          <span :class="LABEL_CLASS"> Your email </span>
          <input
            ref="emailInput"
            v-model="email"
            type="email"
            required
            :maxlength="MAX.email"
            autocomplete="email"
            placeholder="you@example.com"
            :aria-invalid="fieldError === 'email' || undefined"
            :aria-describedby="
              fieldError === 'email' ? 'contact-email-error' : undefined
            "
            :class="FIELD_CLASS"
          />
          <span
            v-if="fieldError === 'email'"
            id="contact-email-error"
            role="alert"
            class="mt-2 block font-mono text-xs tracking-[0.1em] text-(--danger) uppercase"
          >
            {{ errorMsg }}
          </span>
        </label>
      </div>

      <label class="block">
        <span :class="LABEL_CLASS"> What's this about? </span>
        <input
          v-model="subject"
          type="text"
          :maxlength="MAX.subject"
          placeholder="A project, a question, a hello"
          :class="FIELD_CLASS"
        />
      </label>

      <label class="block">
        <span :class="LABEL_CLASS"> Your message </span>
        <div class="relative">
          <textarea
            ref="messageInput"
            v-model="message"
            required
            :maxlength="MAX.message"
            rows="6"
            placeholder="What's on your mind?"
            :aria-invalid="
              (fieldError === 'general' && !message.trim()) || undefined
            "
            :class="[
              FIELD_CLASS,
              'resize-y font-mono text-[0.95rem] tracking-[0.02em] caret-coral-500',
            ]"
          />
          <!-- Subtle typewriter cursor at rest. -->
          <span
            v-if="!message"
            class="pointer-events-none absolute bottom-3.5 left-4 hidden font-mono text-[0.95rem] text-(--danger) motion-safe:inline"
            aria-hidden="true"
          >
            <span class="caret">▍</span>
          </span>
        </div>
      </label>

      <!-- Cloudflare Turnstile. Renders only when a site key is configured. -->
      <NuxtTurnstile
        v-if="turnstileEnabled"
        ref="turnstile"
        v-model="token"
        :options="{
          'expired-callback': clearToken,
          'error-callback': clearToken,
        }"
      />

      <p
        v-if="fieldError === 'general'"
        role="alert"
        class="font-mono text-xs tracking-[0.1em] text-(--danger) uppercase"
      >
        {{ errorMsg }}
      </p>

      <button
        type="submit"
        :disabled="state === 'sending'"
        class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-(--cta-surface) px-8 py-4 font-mono text-sm font-semibold tracking-[0.15em] text-(--cta-ink) uppercase transition-colors duration-200 hover:bg-coral-400 disabled:opacity-60 sm:w-auto"
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
        class="mt-5 inline-flex items-center gap-2 font-mono text-sm tracking-[0.12em] text-(--accent) uppercase transition-colors hover:text-(--accent-hover)"
      >
        Read something while you wait
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MAX } from "#shared/utils/contact";
import { gsap } from "gsap";
import type {
  ContactFieldError,
  ContactFormState,
} from "../composables/useContactForm";

/**
 * Stateless: every value comes in as a model or prop (see useContactForm),
 * and the only thing this component owns is the DOM choreography — the
 * shake on a rejected submit and the bottle cast on success.
 */
const props = withDefaults(
  defineProps<{
    state: ContactFormState;
    fieldError: ContactFieldError;
    errorMsg: string;
    /** Increments on every rejected submit; the form shakes on each bump. */
    failCount: number;
    /** Render the Turnstile widget (false when no site key is configured). */
    turnstileEnabled: boolean;
    /** Slug of the most recent post, for the "read while you wait" link. */
    latestPostSlug?: string;
  }>(),
  { latestPostSlug: "" },
);

const emit = defineEmits<{
  submit: [];
  /** The cast animation has finished (or was skipped); mark the form sent. */
  castComplete: [];
}>();

const name = defineModel<string>("name", { required: true });
const email = defineModel<string>("email", { required: true });
const subject = defineModel<string>("subject", { required: true });
const message = defineModel<string>("message", { required: true });
const token = defineModel<string>("token", { required: true });
const cork = defineModel<string>("cork", { required: true });

const clearToken = () => {
  token.value = "";
};

// Shared by every text field; the message textarea layers its own look on top.
const LABEL_CLASS =
  "mb-2 block font-mono text-xs tracking-[0.15em] text-(--muted) uppercase";
const FIELD_CLASS =
  "w-full rounded-md border border-(--hairline) bg-(--surface) px-4 py-3 text-(--color) placeholder:text-(--muted)/80 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40 focus:outline-none";

const reducedMotion = useReducedMotion();

let shakeTween: gsap.core.Tween | undefined;
let castTimeline: gsap.core.Timeline | undefined;

onBeforeUnmount(() => {
  shakeTween?.kill();
  castTimeline?.kill();
});
const formEl = ref<HTMLElement | null>(null);
const bottleEl = ref<HTMLElement | null>(null);
const successEl = ref<HTMLElement | null>(null);

const turnstile = ref<{ reset: () => void } | null>(null);

const nameInput = ref<HTMLInputElement | null>(null);
const emailInput = ref<HTMLInputElement | null>(null);
const messageInput = ref<HTMLTextAreaElement | null>(null);

// Put the caret where the problem is. Without this the error text appears far
// from the keyboard user's position and they have to hunt for the bad field.
const focusFirstInvalid = () => {
  if (props.fieldError === "email") return emailInput.value?.focus();
  if (!name.value.trim()) return nameInput.value?.focus();
  if (!message.value.trim()) return messageInput.value?.focus();
};

const shake = () => {
  if (reducedMotion.value || !formEl.value) return;
  shakeTween?.kill();
  shakeTween = gsap.fromTo(
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
  if (reducedMotion.value) {
    emit("castComplete");
    return;
  }

  const tl = gsap.timeline();
  castTimeline = tl;

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
  // The distance is measured so the bottle travels only as far as it takes to
  // clear the viewport, and the bob is exactly as long as the drift: anything
  // longer is time spent animating an off-screen bottle on an empty page.
  tl.to(
    bottleEl.value,
    {
      x: () =>
        window.innerWidth -
        (bottleEl.value?.firstElementChild?.getBoundingClientRect().left ?? 0) +
        24,
      rotation: 6,
      duration: 1.6,
      ease: "power1.in",
    },
    "+=0.15",
  );
  tl.to(
    bottleEl.value,
    {
      y: "-=22",
      repeat: 3,
      yoyo: true,
      duration: 0.4,
      ease: "sine.inOut",
    },
    "<",
  );

  // 5. Reveal the note.
  tl.add(() => {
    emit("castComplete");
  });
  tl.from(successEl.value, {
    opacity: 0,
    y: 18,
    duration: 0.5,
    ease: "power3.out",
  });
};

watch(reducedMotion, (reduce) => {
  if (reduce) {
    shakeTween?.progress(1);
    castTimeline?.progress(1);
  }
});

watch(
  () => props.failCount,
  () => {
    shake();
    nextTick(focusFirstInvalid);
  },
);

watch(
  () => props.state,
  (next, prev) => {
    if (next === "casting") playCast();
    // A failed send (sending → idle) spent the single-use Turnstile token;
    // fetch a fresh one so the visitor can simply try again.
    if (prev === "sending" && next === "idle") turnstile.value?.reset();
  },
);
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
