/**
 * One post with its rendered HTML and its chronological neighbours (in `meta`,
 * so the page needs no second request). Requested by the app as
 * /api/writing/<slug>.json; the suffix is what gives the prerendered static
 * file a JSON content type on Cloudflare Pages, and is stripped here.
 */

import type { WritingPostDocument } from "#shared/utils/writing";

export default defineEventHandler(
  async (event): Promise<WritingPostDocument> => {
    const slug = getRouterParam(event, "slug")?.replace(/\.json$/, "");

    const posts = await readWritingPosts();
    const index = posts.findIndex((post) => post.meta.slug === slug);
    const post = posts[index];
    if (!post) {
      throw createError({ statusCode: 404, statusMessage: "Post not found" });
    }

    const { slug: id, ...attributes } = post.meta;
    return {
      data: {
        type: "posts",
        id,
        attributes: { ...attributes, html: renderPostHtml(post.body, id) },
      },
      meta: findNeighbours(posts, index),
    };
  },
);
