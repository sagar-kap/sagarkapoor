import assert from "node:assert/strict";
import test from "node:test";
import { Feed } from "rivu";
import { create } from "xmlbuilder2";
import { withArticleContent } from "../server/utils/feed.ts";
import { validateFrontmatter } from "../server/utils/frontmatter.ts";
import { renderPostHtml } from "../server/utils/markdown.ts";

test("invalid calendar dates report the offending file and field", () => {
  for (const date of ["2026-02-29", "2026-13-01"]) {
    assert.throws(
      () =>
        validateFrontmatter(
          { title: "Note", excerpt: "Intro", date },
          "note.md",
        ),
      /note\.md: invalid frontmatter\n.*field "date"/,
    );
  }
});

test("heading anchors are unique even when a heading contains a generated suffix", () => {
  const html = renderPostHtml(
    "## Notes\n## Notes\n## Notes 1\n## Notes",
    "note",
  );
  const ids = [...html.matchAll(/<h2 id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(ids, ["notes", "notes-1", "notes-1-1", "notes-2"]);
  for (const id of ids) assert.ok(html.includes(`href="#${id}"`));
});

test("Rivu excerpts and full HTML bodies round-trip by GUID", () => {
  const link = "https://example.org";
  const bodies = new Map([
    [link + "/two", "<p>Two &amp; more.</p>"],
    [link + "/one", "<pre>&lt;/item&gt; ]]> </pre>"],
  ]);
  const items = [link + "/one", link + "/two"].map((guid) => ({
    guid,
    title: "RSS & XML",
    description: "An excerpt containing </item>.",
  }));
  const feed = new Feed({
    title: "Notes",
    link,
    description: "Writing",
    items,
  });
  const xml = withArticleContent(feed.generate(), bodies);
  const doc = create(xml).node;
  const entries = Array.from(doc.getElementsByTagName("item"));
  assert.equal(entries.length, 2);
  for (const entry of entries) {
    const guid = entry.getElementsByTagName("guid")[0].textContent;
    assert.equal(
      entry.getElementsByTagName("description")[0].textContent,
      items[0].description,
    );
    assert.equal(
      entry.getElementsByTagNameNS(
        "http://purl.org/rss/1.0/modules/content/",
        "encoded",
      )[0].textContent,
      bodies.get(guid),
    );
  }
});
