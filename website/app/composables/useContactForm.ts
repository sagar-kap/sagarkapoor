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
import { validateContact } from "#shared/utils/contact";

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
  cork: string;
}

const FALLBACK_ERROR = "Couldn't send — please try again.";

/**
 * Pull the server's own wording out of a failed $fetch.
 *
 * h3's createError puts `statusMessage` in the JSON body, which ofetch exposes
 * as `error.data`. It ALSO lands on `error.statusMessage` — but only because
 * ofetch copies the HTTP reason phrase, and HTTP/2 (what Cloudflare serves)
 * dropped reason phrases entirely. Reading only the top-level field therefore
 * works in local dev over HTTP/1.1 and silently degrades to the generic
 * fallback in production, hiding messages like "Message too long." Check the
 * body first.
 */
export const serverMessage = (error: unknown): string => {
  const e = error as {
    data?: { statusMessage?: string; message?: string };
    statusMessage?: string;
  };
  return (
    e?.data?.statusMessage?.trim() ||
    e?.data?.message?.trim() ||
    e?.statusMessage?.trim() ||
    FALLBACK_ERROR
  );
};

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
    cork: "",
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
    // Re-entry guard. The button's :disabled only takes effect on the next
    // render, so two clicks inside one frame both reach this function and
    // both POST — the visitor's message arrives twice.
    if (state.value !== "idle") return;

    // Honeypot tripped → fake success, send nothing.
    if (fields.cork) {
      state.value = "sent";
      return;
    }

    fieldError.value = "";
    errorMsg.value = "";

    const checked = validateContact(fields);
    if (!checked.ok) {
      fail(checked.field, checked.message);
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
          cork: fields.cork,
        },
      });
      state.value = "casting";
    } catch (error) {
      // The token is single-use and this attempt spent it (or it expired).
      // Drop it; BottleForm resets the widget when state returns to idle.
      fields.token = "";
      state.value = "idle";
      fail("general", serverMessage(error));
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
