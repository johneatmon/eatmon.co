import matter from 'gray-matter';
import 'server-only';
import { postFiles } from '~/content/blog/load';

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  draft?: boolean;
  content: string;
  readingTime: string;
};

const WORDS_PER_MINUTE = 225;

function formatReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

function parsePost(filePath: string, raw: string): Post {
  const filename = filePath.split('/').at(-1) ?? filePath;
  const slug = filename.replace(/\.mdx$/, '');
  const { data, content } = matter(raw);

  if (!data.title || !data.description || !data.date) {
    throw new Error(`Post "${slug}" is missing required frontmatter`);
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description),
    date: String(data.date),
    updated: data.updated ? String(data.updated) : undefined,
    draft: Boolean(data.draft),
    content,
    readingTime: formatReadingTime(content),
  };
}

export function getAllPosts(): Post[] {
  return Object.entries(postFiles)
    .map(([filePath, raw]) => parsePost(filePath, raw))
    .filter((post) => process.env.NODE_ENV === 'development' || !post.draft)
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
