import { siteUrl } from '~/lib/utils';

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: [
          'CCBot',
          'GPTBot',
          'Google-Extended',
          'ClaudeBot',
          'anthropic-ai',
          'Bytespider',
        ],
        allow: '/',
        disallow: '/blog/',
      },
    ],
    sitemap: siteUrl('/sitemap.xml'),
    host: siteUrl(),
  };
}
