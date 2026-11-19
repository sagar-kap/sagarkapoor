import { create } from "xmlbuilder2";

const CONTENT_NAMESPACE = "http://purl.org/rss/1.0/modules/content/";

export const withArticleContent = (
  xml: string,
  articles: ReadonlyMap<string, string>,
) => {
  const root = create(xml).root().att("xmlns:content", CONTENT_NAMESPACE);
  const items = root.filter((el) => el.node.nodeName === "item", false, true);
  for (const item of items) {
    const guid = item.find((el) => el.node.nodeName === "guid")?.node
      .textContent;
    const html = articles.get(guid ?? "");
    if (html === undefined)
      throw new Error(`rss.xml: missing article for GUID "${guid}"`);
    const content = item.ele(CONTENT_NAMESPACE, "content:encoded");
    // Split between ]] and > so even an article about XML round-trips exactly.
    for (const part of html.split(/(?<=\]\])(?=>)/)) content.dat(part);
  }
  return root.end();
};
