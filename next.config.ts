import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const root = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    rules: {
      // Turn Markdown/MDX into JS string modules for content HMR.
      '*.md': {
        loaders: [path.join(root, 'scripts/raw-mdx-loader.cjs')],
        as: '*.js',
      },
      '*.mdx': {
        loaders: [path.join(root, 'scripts/raw-mdx-loader.cjs')],
        as: '*.js',
      },
    },
  },
  async headers() {
    return [
      {
        source: '/sitemap.xsl',
        headers: [{ key: 'Content-Type', value: 'application/xslt+xml; charset=utf-8' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/work/:slug*',
        destination: 'https://read.cv/johneatmon',
        permanent: false,
      },
      {
        source: '/project/:slug*',
        destination: 'https://read.cv/johneatmon/npsVXnwnPLc03Cfs6863',
        permanent: false,
      },
      {
        source: '/about',
        destination: '/',
        permanent: false,
      },
      {
        source: '/about/colophon',
        destination: '/colophon',
        permanent: true,
      },
      {
        source: '/about/tools',
        destination: '/blog/things-i-use',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
