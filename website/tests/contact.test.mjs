import assert from "node:assert/strict";
import test from "node:test";
import { sendContactEmail } from "../server/utils/resend.ts";

test("contact delivery uses the configured recipients and the visitor's reply address", async (t) => {
  const mail = {
    replyTo: "visitor@example.org",
    subject: "Website enquiry",
    text: "Hello",
  };
  const config = {
    contactFrom: "site@example.org",
    contactTo: " one@example.org, , two@example.org ",
    resendApiKey: "test-key",
  };
  const fetch = t.mock.fn(async () => ({ id: "test" }));
  globalThis.useRuntimeConfig = () => config;
  globalThis.$fetch = fetch;
  globalThis.createError = ({ statusCode, statusMessage }) =>
    Object.assign(new Error(statusMessage), { statusCode });
  t.after(() => {
    delete globalThis.useRuntimeConfig;
    delete globalThis.$fetch;
    delete globalThis.createError;
  });
  await sendContactEmail({}, mail);
  assert.equal(fetch.mock.callCount(), 1);
  const [url, options] = fetch.mock.calls[0].arguments;
  assert.equal(url, "https://api.resend.com/emails");
  assert.deepEqual(options.body, {
    from: config.contactFrom,
    to: ["one@example.org", "two@example.org"],
    reply_to: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
  assert.equal(options.headers.Authorization, "Bearer test-key");
  config.contactTo = " , ";
  await assert.rejects(sendContactEmail({}, mail), { statusCode: 500 });
  assert.equal(fetch.mock.callCount(), 1);
});
