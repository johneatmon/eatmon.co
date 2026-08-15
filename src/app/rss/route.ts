import { getAllPosts } from '~/lib/posts';
import { siteUrl } from '~/lib/utils';

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(
      (post) => `
                <item>
                  <title><![CDATA[${post.title}]]></title>
                  <link>${siteUrl(`/blog/${post.slug}`)}</link>
                  <guid>${siteUrl(`/blog/${post.slug}`)}</guid>
                  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
                  <description><![CDATA[${post.description}]]></description>
                </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
                <rss version="2.0">
                  <channel>
                    <title>John Eatmon</title>
                    <link>${siteUrl()}</link>
                    <description>Notes on development, technology, and typography.</description>
                    <language>en-us</language>
                    ${items}
                  </channel>
                </rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
