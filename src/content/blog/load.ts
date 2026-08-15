import 'server-only';

// Colocated with the MDX files so Turbopack's import.meta.glob can watch them.
// next.config.ts maps `*.mdx` → type: 'raw' so these resolve as strings.
// https://nextjs.org/docs/app/api-reference/turbopack#importmetaglob
export const postFiles = import.meta.glob('./*.mdx', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
