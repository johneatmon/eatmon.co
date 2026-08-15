import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PostListItem } from '~/components/post-list-item';
import { ReturnLink } from '~/components/return-link';
import { getTotalBlogViews } from '~/lib/db';
import { getAllPosts } from '~/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on development, technology, and typography.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <ReturnLink href="/">Index</ReturnLink>
      <header className="reveal mt-12 mb-10">
        <h1 className="text-4xl tracking-[-0.04em] text-balance sm:text-5xl">Blog</h1>
        <p className="mt-4 text-[12px] tracking-[0.04em] text-[var(--muted)]">
          {posts.length.toLocaleString()} posts
          <Suspense fallback={null}>
            {' '}
            · <TotalViews />
          </Suspense>
        </p>
      </header>
      <div className="reveal reveal-delay-1">
        {posts.map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}

async function TotalViews() {
  const total = await getTotalBlogViews();
  if (!total) return null;
  return <span>{total.toLocaleString()} views</span>;
}
