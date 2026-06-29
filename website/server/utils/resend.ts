import type { H3Event } from "h3";

interface SendEmailOptions {
  from: string;
  // A single address or several — the Resend API accepts an array for `to`.
  to: string | string[];
  replyTo?: string;
  subject: string;
  text: string;
}

/**
 * Send a transactional email via the Resend REST API.
 *
 * We call the HTTP API directly rather than the `resend` SDK on purpose: the
 * SDK imports `@react-email/render` (React) for its JSX-email feature, which
 * Nitro can't bundle for the Cloudflare Workers/edge build (`externals are not
 * allowed`). A plain fetch is lighter, edge-native, and we only send text.
 *
 * Reads the API key from runtimeConfig (NUXT_RESEND_API_KEY, injected at
 * deploy). Throws a 500 if it's missing so a misconfigured deploy fails loudly.
 * Throws (via $fetch) on a non-2xx Resend response so callers can map it.
 */
export const sendEmail = async (event: H3Event, options: SendEmailOptions) => {
  const { resendApiKey } = useRuntimeConfig(event);

  if (!resendApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Email is not configured on the server.",
    });
  }

  return $fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendApiKey}` },
    body: {
      from: options.from,
      to: options.to,
      reply_to: options.replyTo,
      subject: options.subject,
      text: options.text,
    },
  });
};
