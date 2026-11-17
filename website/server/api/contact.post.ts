/**
 * Contact form → Resend (transactional). The whole reason Sagar's address stays
 * private: the public page exposes no `mailto:`. Visitors POST their message and
 * the server relays it to NUXT_CONTACT_TO — the real inbox lives only in env,
 * never in the DOM. The visitor's address goes into `reply_to`, so a reply in
 * his mail client answers them directly.
 *
 * Guards, in order: honeypot (`cork` — hidden field bots fill, humans never
 * see), required-field + email-shape + length checks (shared with the client,
 * see shared/utils/contact.ts), then Cloudflare Turnstile verification last, so
 * a rejected form doesn't spend the visitor's single-use token.
 */
import { validateContact } from "#shared/utils/contact";

export default defineEventHandler(async (event) => {
  // Rate limiting is not handled here: it will be a Cloudflare rate-limiting
  // rule on /api/contact, configured in the dashboard at launch.

  const body = await readBody<unknown>(event);

  if (typeof body !== "object" || body === null) {
    throw createError({
      statusCode: 400,
      statusMessage: "That message didn't come out right — please try again.",
    });
  }
  const { cork, turnstileToken } = body as Record<string, unknown>;

  // Honeypot tripped → pretend success, send nothing. Bots get a 200 and leave.
  if (cork) return { ok: true };

  // Fields and lengths first. A Turnstile token is single-use, so verifying it
  // before a check that can still fail would burn the token and make every
  // retry bounce with "Anti-spam check failed".
  const checked = validateContact(body);
  if (!checked.ok) {
    throw createError({ statusCode: 400, statusMessage: checked.message });
  }
  const { name, email, subject, message } = checked.value;

  if (typeof turnstileToken !== "string" || !turnstileToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please complete the anti-spam check.",
    });
  }

  const turnstile = await verifyTurnstileToken(turnstileToken);
  if (!turnstile.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Anti-spam check failed — please try again.",
    });
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
