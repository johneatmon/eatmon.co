import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { BlogPosting } from 'schema-dts';
import { Mdx } from '~/components/mdx';
import { ReturnLink } from '~/components/return-link';
import { ViewCounter } from '~/components/view-counter';
import { getViewsCount } from '~/lib/db';
import { getAllPosts, getPost } from '~/lib/posts';
import { cn, formatDate, siteUrl, toJsonLd } from '~/lib/utils';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const ogImage = siteUrl(`/og?title=${encodeURIComponent(post.title)}`);

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: post.updated ? new Date(post.updated).toISOString() : undefined,
      url: siteUrl(`/blog/${post.slug}`),
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const posts = getAllPosts();
  const index = posts.findIndex((entry) => entry.slug === post.slug);
  const prevPost = posts[index + 1] ?? null;
  const nextPost = posts[index - 1] ?? null;

  const jsonLd = toJsonLd<BlogPosting>({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: new Date(post.date).toISOString(),
    dateModified: post.updated ? new Date(post.updated).toISOString() : undefined,
    description: post.description,
    image: siteUrl(`/og?title=${encodeURIComponent(post.title)}`),
    url: siteUrl(`/blog/${post.slug}`),
    author: {
      '@type': 'Person',
      name: 'John Eatmon',
    },
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <ReturnLink href="/blog">Blog</ReturnLink>
      <article className="reveal mt-12">
        <header className="mb-12 max-w-2xl">
          <h1 className="text-4xl leading-[1.08] tracking-[-0.045em] text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[color-mix(in_oklab,var(--foreground)_72%,transparent)]">
            {post.description}
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-(--muted)">
            <time dateTime={new Date(post.date).toISOString()}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            <Suspense fallback={null}>
              <span aria-hidden="true">·</span>
              <Views slug={`/blog/${post.slug}`} track />
            </Suspense>
          </p>
        </header>
        <Mdx source={post.content} />
      </article>

      {(prevPost || nextPost) && (
        <nav
          className={cn(
            'mt-16 grid gap-8 border-t border-(--border) pt-10 sm:grid-cols-2',
            nextPost && !prevPost && 'sm:justify-items-end',
          )}
        >
          {prevPost && (
            <div>
              <p className="mb-2 text-[11px] tracking-[0.08em] text-(--muted) uppercase">
                Previous
              </p>
              <Link
                href={`/blog/${prevPost.slug}`}
                className="line-clamp-2 no-underline tracking-[-0.02em] text-(--foreground) transition-opacity duration-200 hover:opacity-70"
              >
                {prevPost.title}
              </Link>
            </div>
          )}
          {nextPost && (
            <div className="sm:text-right">
              <p className="mb-2 text-[11px] tracking-[0.08em] text-(--muted) uppercase">Next</p>
              <Link
                href={`/blog/${nextPost.slug}`}
                className="line-clamp-2 no-underline tracking-[-0.02em] text-(--foreground) transition-opacity duration-200 hover:opacity-70"
              >
                {nextPost.title}
              </Link>
            </div>
          )}
        </nav>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </main>
  );
}

async function Views({ slug, track = false }: { slug: string; track?: boolean }) {
  const views = await getViewsCount();
  if (!views.length && !track) return null;

  return (
    <ViewCounter views={views} slug={slug} track={track && process.env.NODE_ENV === 'production'} />
  );
}
