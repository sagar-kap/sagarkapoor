import assert from "node:assert/strict";
import test from "node:test";

test("the Pages Worker verifies Turnstile before relaying contact mail", async (t) => {
  const env = {
    NUXT_TURNSTILE_SECRET_KEY: "test-turnstile",
    NUXT_RESEND_API_KEY: "test-resend",
    NUXT_CONTACT_FROM: "site@example.org",
    NUXT_CONTACT_TO: "owner@example.org",
  };
  let acceptToken = false;
  let deliver = false;
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push(url);
    if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
      assert.equal(
        new URLSearchParams(options.body).get("secret"),
        env.NUXT_TURNSTILE_SECRET_KEY,
      );
      return Response.json({ success: acceptToken });
    }
    assert.equal(url, "https://api.resend.com/emails");
    return Response.json(
      deliver ? { id: "test" } : { message: "unavailable" },
      { status: deliver ? 200 : 503 },
    );
  });
  const { default: worker } = await import("../../dist/_worker.js/index.js");
  const submit = async (fields) => {
    const request = new Request("https://example.org/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(fields),
    });
    const response = await worker.fetch(request, env, { waitUntil: () => {} });
    return response.status;
  };
  const fields = {
    name: "Visitor",
    email: "visitor@example.org",
    message: "Hello",
  };
  assert.equal(await submit({}), 400);
  assert.equal(await submit(fields), 400);
  assert.equal(await submit({ cork: "filled" }), 200);
  assert.equal(calls.length, 0);

  const submission = { ...fields, turnstileToken: "test-token" };
  assert.equal(await submit(submission), 400);
  assert.equal(calls.length, 1);
  acceptToken = true;
  assert.equal(await submit(submission), 502);
  deliver = true;
  assert.equal(await submit(submission), 200);
  assert.equal(calls.length, 5);
});
