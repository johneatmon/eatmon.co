import Link from 'next/link';
import { Suspense } from 'react';
import { ViewCounter } from '~/components/view-counter';
import { getViewsCount } from '~/lib/db';
import type { Post } from '~/lib/posts';
import { formatDate } from '~/lib/utils';

export function PostListItem({ post }: { post: Post }) {
  return (
    <div className="group flex flex-col gap-1.5 border-b border-(--border) py-5 first:pt-0 last:border-b-0">
      <Link href={`/blog/${post.slug}`} className="no-underline">
        <h3 className="text-base tracking-[-0.02em] text-(--foreground) transition-opacity duration-200 group-hover:opacity-70">
          {post.title}
        </h3>
      </Link>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] tracking-[0.04em] text-(--muted)">
        <time dateTime={new Date(post.date).toISOString()}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime}</span>
        <Suspense fallback={null}>
          <span aria-hidden="true">·</span>
          <Views slug={post.slug} />
        </Suspense>
      </div>
    </div>
  );
}

async function Views({ slug }: { slug: string }) {
  const views = await getViewsCount();
  if (!views.length) return null;
  return <ViewCounter views={views} slug={`/blog/${slug}`} />;
}
