import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';
import type { BlogPosting } from 'schema-dts';
import smartypants from 'smartypants';
import type { Blog } from '~/.contentlayer/generated';
import ViewCounter from '~/app/blog/view-counter';
import { Mdx } from '~/components/mdx';
import ReturnLink from '~/components/return-link';
import { getViewsCount } from '~/lib/planetscale';
import { cn, filteredPosts, toJsonLd } from '~/lib/utils';
import '~/styles/blog.css';

type BlogPostProps = {
	readonly params: {
		slug: string;
	};
};

export const generateMetadata = ({ params }: BlogPostProps): Metadata => {
	const currentPath = params.slug;
	const post = filteredPosts.find(({ slugAsParams }) => slugAsParams === currentPath);

	if (!post) {
		return {};
	}

	const { title, description, date, updated } = post;
	const ogImageUrlParams = new URLSearchParams({ title });
	const ogImage = new URL(`/og?${ogImageUrlParams}`, process.env.NEXT_PUBLIC_VERCEL_URL).href;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime: new Date(date).toISOString(),
			modifiedTime: updated ? new Date(updated).toISOString() : undefined,
			url: new URL(`/blog/${currentPath}`, process.env.NEXT_PUBLIC_VERCEL_URL),
			authors: 'John Eatmon',
			images: [{ url: ogImage }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
};

export const generateStaticParams = (): BlogPostProps['params'][] =>
	filteredPosts.map((post) => ({
		slug: post.slug,
	}));

const generateJsonLd = (post: Blog) => {
	const ogImageUrlParams = new URLSearchParams({ title: post.title });
	const ogImage = new URL(`/og?${ogImageUrlParams}`, process.env.NEXT_PUBLIC_VERCEL_URL).href;

	return toJsonLd<BlogPosting>({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		datePublished: new Date(post.date).toISOString(),
		dateModified: post.updated ? new Date(post.updated).toISOString() : undefined,
		description: post.description,
		image: ogImage,
		url: new URL(post.slug, process.env.NEXT_PUBLIC_VERCEL_URL).href,
		author: {
			'@type': 'Person',
			name: 'John Eatmon',
		},
	});
};

const BlogPost: FC<BlogPostProps> = ({ params }) => {
	const currentPath = params.slug;
	const post = filteredPosts.find(({ slugAsParams }) => slugAsParams === currentPath);

	if (!post) {
		notFound();
	}

	const blogPostJsonLd = generateJsonLd(post);

	const prevPost =
		filteredPosts
			.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
			.at(filteredPosts.indexOf(post) - 1) || null;
	const nextPost =
		filteredPosts
			.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
			.at(filteredPosts.indexOf(post) + 1) || null;

	return (
		<main className='relative mx-auto flex max-w-2xl flex-col px-4 pb-24 pt-[128px]'>
			{/* <div className='pointer-events-none absolute -inset-x-8 bottom-0 top-8 z-[-1] bg-gray-50/5' /> */}
			<ReturnLink href='/blog'>Back to Blog</ReturnLink>
			<h1
				className='mb-4 mt-16 scroll-m-20 text-4xl font-bold leading-[1.1em] tracking-tighter text-gray-950 dark:text-gray-50'
				dangerouslySetInnerHTML={{ __html: smartypants(post.title, 1) }}
			/>
			<p
				className='mb-3 text-gray-700 dark:text-gray-300'
				dangerouslySetInnerHTML={{ __html: smartypants(post.description, 1) }}
			/>
			<small className='mb-8 flex items-center gap-x-1 text-gray-500'>
				<time dateTime={new Date(post.date).toISOString()}>
					{new Date(post.date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</time>
				<Suspense fallback={<span className='inline-block h-5' />}>
					&middot;
					<Views slug={post.slug} />
				</Suspense>
			</small>
			<Mdx code={post.body.code} />
			{(prevPost || nextPost) && (
				<footer
					className={cn(
						'mt-10 flex items-center gap-1 border-t border-gray-950/60 py-10 text-sm',
						nextPost && !prevPost && 'justify-end'
					)}
				>
					{prevPost && (
						<div aria-label='Previous post' className='w-1/2 font-sans'>
							<span className='mb-0.5 inline-block text-gray-500'>Previous</span>
							<Link
								className='line-clamp-1 font-[450] dark:text-gray-50'
								href={prevPost.slug}
								title={prevPost.title}
							>
								{prevPost.title}
							</Link>
						</div>
					)}
					{nextPost && (
						<div aria-label='Next post' className='w-1/2 text-right font-sans'>
							<span className='mb-0.5 inline-block text-gray-500'>Next</span>
							<Link
								className='line-clamp-1 font-[450] dark:text-gray-50'
								href={nextPost.slug}
								title={nextPost.title}
							>
								{nextPost.title}
							</Link>
						</div>
					)}
				</footer>
			)}
			<span dangerouslySetInnerHTML={{ __html: blogPostJsonLd }} />
		</main>
	);
};

async function Views({ slug }: { slug: string }) {
	const views = await getViewsCount();

	if (!views) {
		return null;
	}

	return <ViewCounter views={views} slug={slug} track={process.env.NODE_ENV === 'production'} />;
}

export default BlogPost;
