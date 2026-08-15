import { getAllPosts } from '~/lib/posts';
import { siteUrl } from '~/lib/utils';

export const dynamic = 'force-static';

type SitemapEntry = {
  url: string;
  lastModified: string;
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toDate(value: string | Date) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

function entries(): SitemapEntry[] {
  const blogs = getAllPosts().map((post) => ({
    url: siteUrl(`/blog/${post.slug}`),
    lastModified: toDate(post.updated || post.date),
  }));

  const routes = ['', '/blog', '/colophon', '/rss'].map((route) => ({
    url: siteUrl(route),
    lastModified: toDate(new Date()),
  }));

  return [...routes, ...blogs];
}

export function GET() {
  const body = entries()
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${escapeXml(entry.lastModified)}</lastmod>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
