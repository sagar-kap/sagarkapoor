/**
 * Contact form → Resend (transactional). The whole reason Sagar's address stays
 * private: the public page exposes no `mailto:`. Visitors POST their message and
 * the server relays it to NUXT_CONTACT_TO — the real inbox lives only in env,
 * never in the DOM. The visitor's address goes into `reply_to`, so a reply in
 * his mail client answers them directly.
 *
 * Guards, in order: honeypot (`website` — hidden field bots fill, humans never
 * see), Cloudflare Turnstile verification, required-field + email-shape checks,
 * and length caps so the textarea can't fire huge payloads.
 */

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  turnstileToken?: string;
  website?: string; // honeypot — must stay empty
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 100, email: 200, subject: 150, message: 4000 } as const;

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactPayload>(event);

  // Honeypot tripped → pretend success, send nothing. Bots get a 200 and leave.
  if (body.website) return { ok: true };

  // Verify the Turnstile token before doing anything expensive.
  const token = body.turnstileToken ?? "";
  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please complete the anti-spam check.",
    });
  }

  const turnstile = await verifyTurnstileToken(token);
  if (!turnstile.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Anti-spam check failed — please try again.",
    });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name, email, and message are all required.",
    });
  }

  if (!EMAIL_RE.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "That email address doesn't look right.",
    });
  }

  if (
    name.length > MAX.name ||
    email.length > MAX.email ||
    subject.length > MAX.subject ||
    message.length > MAX.message
  ) {
    throw createError({ statusCode: 400, statusMessage: "Message too long." });
  }

  const { contactTo, contactFrom } = useRuntimeConfig(event);

  if (!contactTo || !contactFrom) {
    throw createError({
      statusCode: 500,
      statusMessage: "Email is not configured on the server.",
    });
  }

  // ISO timestamp goes in the subject so every submission is unique and Gmail /
  // Outlook don't thread separate enquiries into one collapsed conversation.
  const submittedAt = new Date().toISOString();

  // NUXT_CONTACT_TO may be a single address or a comma-separated list.
  const recipients = contactTo
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  const headline = subject || "No subject";

  const text = [
    `Sender: ${name}`,
    `Email: ${email}`,
    `Subject: ${headline}`,
    `Submitted: ${submittedAt}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    await sendEmail(event, {
      from: contactFrom,
      to: recipients,
      replyTo: email,
      subject: `Message in a bottle — ${name}: ${headline} [${submittedAt}]`,
      text,
    });
  } catch (error) {
    console.error("[api/contact] Resend send failed:", error);
    throw createError({
      statusCode: 502,
      statusMessage: "Couldn't send right now — please try again shortly.",
    });
  }

  return { ok: true };
});
