import { routes, type VercelConfig } from '@vercel/config/v1';

/**
 * Config-route mitigations only support `challenge` | `deny` — not rate limits.
 * Hobby includes 1 WAF rate-limit rule: point it at POST /api/views (see README).
 */
export const config: VercelConfig = {
  buildCommand: 'pnpm build',
  installCommand: 'pnpm config set "//npm.pkg.github.com/:_authToken" "$GITHUB_PAT" && pnpm install',
  cleanUrls: true,
  framework: 'nextjs',
  regions: ['pdx1'],
  trailingSlash: false,
  redirects: [
    routes.redirect('/github', 'https://github.com/johneatmon'),
    routes.redirect('/x', 'https://twitter.com/johneatmon_'),
    routes.redirect('/cv', 'https://read.cv/johneatmon'),
    routes.redirect('/soundcloud', 'https://soundcloud.com/sea-wash'),
  ],
  // Block non-POST traffic to the views endpoint at the edge.
  routes: [
    {
      src: '^/api/views/?$',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
      mitigate: { action: 'deny' },
    },
  ],
};
