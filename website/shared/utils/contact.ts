/**
 * Contact-form rules shared by the client (app/composables/useContactForm.ts)
 * and the Nitro route (server/api/contact.post.ts), imported via the #shared
 * alias so the two can't drift: the same length caps, the same email check, the
 * same wording. Pure — no DOM, no Node APIs — so it runs in the browser bundle
 * and the Cloudflare Worker alike.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX = {
  name: 100,
  email: 200,
  subject: 150,
  message: 4000,
} as const;

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactValidation =
  | { ok: true; value: ContactInput }
  | { ok: false; field: "email" | "general"; message: string };

const tooLong = (label: string, max: number) =>
  `${label} is too long — ${max} characters at most.`;

/**
 * Check the visitor-supplied fields. `input` is untyped on purpose: the server
 * hands over a parsed request body that could be anything. Returns the trimmed
 * fields, or which field to blame and what to say about it.
 */
export const validateContact = (input: unknown): ContactValidation => {
  const raw = (input ?? {}) as Record<string, unknown>;
  const { name, email, message } = raw;
  const subject = raw.subject ?? "";

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return {
      ok: false,
      field: "general",
      message: "That message didn't come out right — please try again.",
    };
  }

  const value: ContactInput = {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  };

  if (!value.name || !value.message) {
    return {
      ok: false,
      field: "general",
      message: "Name and message are both required.",
    };
  }
  if (!EMAIL_RE.test(value.email)) {
    return {
      ok: false,
      field: "email",
      message: "That email doesn't look right.",
    };
  }
  if (value.name.length > MAX.name) {
    return { ok: false, field: "general", message: tooLong("Name", MAX.name) };
  }
  if (value.email.length > MAX.email) {
    return { ok: false, field: "email", message: tooLong("Email", MAX.email) };
  }
  if (value.subject.length > MAX.subject) {
    return {
      ok: false,
      field: "general",
      message: tooLong("Subject", MAX.subject),
    };
  }
  if (value.message.length > MAX.message) {
    return {
      ok: false,
      field: "general",
      message: tooLong("Message", MAX.message),
    };
  }

  return { ok: true, value };
};
