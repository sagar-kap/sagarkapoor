import type { H3Event } from "h3";

interface ContactEmail {
  replyTo: string;
  subject: string;
  text: string;
}

// Use Resend's HTTP endpoint so the edge Worker only needs fetch.
export const sendContactEmail = async (event: H3Event, mail: ContactEmail) => {
  const { resendApiKey, contactFrom, contactTo } = useRuntimeConfig(event);
  const recipients = contactTo
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  if (!resendApiKey || !contactFrom || !recipients.length) {
    throw createError({
      statusCode: 500,
      statusMessage: "Email is not configured on the server.",
    });
  }

  try {
    await $fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}` },
      body: {
        from: contactFrom,
        to: recipients,
        reply_to: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
      },
    });
  } catch (error) {
    // Log the failure type without recording headers or a visitor's message.
    console.error(
      "[api/contact] Resend delivery failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    throw createError({
      statusCode: 502,
      statusMessage: "Couldn't send right now — please try again shortly.",
    });
  }
};
