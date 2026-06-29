---
title: "A boring stack is usually a fast one"
date: "2026-04-02"
excerpt: "Nuxt, markdown, a CDN. The least exciting choices tend to be the ones that quietly hold up — here's why I keep reaching for them."
tags: ["engineering"]
---

Some of the fastest sites I've built were also the most boring to describe. Nuxt. Markdown. A CDN. A server route or two where I actually needed one. It isn't a clever setup, and that's sort of the point.

## Clever has a cost

Every interesting dependency is a small promise to my future self: _I'll keep understanding this._ I don't always keep it, and then the clever thing becomes the part of the codebase nobody wants to touch. Boring tools are just easier to live with — easy to read, easy to replace.

That's not a knock on anyone reaching for newer, shinier things; plenty of them are great, and I reach for them too when they earn their place. It's only where I've landed after enough late nights debugging my own cleverness.

```ts
// The most exciting line in the whole codebase is a cache header.
routeRules: {
  "/**": { prerender: true },
}
```

## Ship it to the edge and relax

When the HTML is already sitting on a CDN near the reader, you don't need much to make it feel fast — it just is. The interesting work is deciding what genuinely has to run at request time (a contact form, an auth check) and letting everything else be static.

- Prerender what you can.
- Run on the edge what you must.
- Reach for a database when a file honestly won't do.

The least flashy option on each of those lines is, more often than not, the one I end up glad I picked.
