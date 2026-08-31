/**
 * Everything the contact form *knows* — field values, validation, the
 * honeypot, Turnstile config, and the POST to /api/contact — with none of
 * what it *shows*. The page owns this state and hands it to the stateless
 * BottleForm as props/models, so the form component stays a pure render of
 * its inputs and this logic is testable without a DOM.
 *
 * State machine: idle → sending → casting → sent. "casting" is the beat
 * where the submission has succeeded and the bottle animation is playing;
 * the form reports back via `markSent` when it's done (immediately under
 * reduced motion).
 */
export type ContactFormState = "idle" | "sending" | "casting" | "sent";
export type ContactFieldError = "" | "email" | "general";

export interface ContactFields {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Cloudflare Turnstile token, when the widget is rendered. */
  token: string;
  /** Honeypot — bots fill it, humans never see it. Must stay empty. */
  website: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useContactForm = () => {
  const runtimeConfig = useRuntimeConfig();
  const turnstileSiteKey =
    (runtimeConfig.public.turnstile as { siteKey?: string } | undefined)
      ?.siteKey ?? "";
  const turnstileEnabled = turnstileSiteKey !== "";

  const fields = reactive<ContactFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
    token: "",
    website: "",
  });

  const state = ref<ContactFormState>("idle");
  const fieldError = ref<ContactFieldError>("");
  const errorMsg = ref("");
  // Bumped on every rejected submit so the form can react (shake) even when
  // the same message repeats.
  const failCount = ref(0);

  const fail = (field: ContactFieldError, msg: string) => {
    fieldError.value = field;
    errorMsg.value = msg;
    failCount.value += 1;
  };

  const submit = async () => {
    // Honeypot tripped → fake success, send nothing.
    if (fields.website) {
      state.value = "sent";
      return;
    }

    fieldError.value = "";
    errorMsg.value = "";

    if (!fields.name.trim() || !fields.message.trim()) {
      fail("general", "Name and message are both required.");
      return;
    }
    if (!EMAIL_RE.test(fields.email.trim())) {
      fail("email", "That email doesn't look right.");
      return;
    }

    // Dev affordance: with no Turnstile configured locally, preview the cast
    // animation without hitting the API (which would reject the missing token).
    if (import.meta.dev && !turnstileEnabled) {
      state.value = "casting";
      return;
    }

    state.value = "sending";
    try {
      await $fetch("/api/contact", {
        method: "POST",
        body: {
          name: fields.name,
          email: fields.email,
          subject: fields.subject,
          message: fields.message,
          turnstileToken: fields.token,
          website: fields.website,
        },
      });
      state.value = "casting";
    } catch (error) {
      state.value = "idle";
      const statusMessage = (error as { statusMessage?: string })
        ?.statusMessage;
      fail("general", statusMessage || "Couldn't send — please try again.");
    }
  };

  const markSent = () => {
    state.value = "sent";
  };

  return {
    fields,
    state,
    fieldError,
    errorMsg,
    failCount,
    turnstileEnabled,
    submit,
    markSent,
  };
};
