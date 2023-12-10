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

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime: new Date(date).toISOString(),
			modifiedTime: updated ? new Date(updated).toISOString() : undefined,
			url: new URL(`/blog/${currentPath}`, process.env.NEXT_PUBLIC_VERCEL_URL!),
			authors: 'John Eatmon',
		},
		twitter: {
			title,
			description,
		},
	};
};

export const generateStaticParams = (): BlogPostProps['params'][] =>
	filteredPosts.map((post) => ({
		slug: post.slug,
	}));

const generateJsonLd = (post: Blog) =>
	toJsonLd<BlogPosting>({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		datePublished: new Date(post.date).toISOString(),
		dateModified: post.updated ? new Date(post.updated).toISOString() : undefined,
		description: post.description,
		image: new URL(`/og?title=${post.title}`, process.env.NEXT_PUBLIC_VERCEL_URL).href,
		url: new URL(post.slug, process.env.NEXT_PUBLIC_VERCEL_URL).href,
		author: {
			'@type': 'Person',
			name: 'John Eatmon',
		},
	});

const BlogPost: FC<BlogPostProps> = ({ params }) => {
	const currentPath = params.slug;
	const post = filteredPosts.find(({ slugAsParams }) => slugAsParams === currentPath);

	if (!post) {
		notFound();
	}

	const blogPostJsonLd = generateJsonLd(post);

	const prevPost = filteredPosts.at(filteredPosts.indexOf(post) - 1) || null;
	const nextPost = filteredPosts.at(filteredPosts.indexOf(post) + 1) || null;

	return (
		<main className='mx-auto flex max-w-2xl flex-col px-4 pb-24 pt-[128px]'>
			<ReturnLink href='/blog'>Back to Blog</ReturnLink>
			<h1
				className='mb-4 mt-16 scroll-m-20 font-sans text-4xl font-bold leading-[1.1em] tracking-tighter text-gray-950 dark:text-gray-50'
				dangerouslySetInnerHTML={{ __html: smartypants(post.title, 1) }}
			/>
			<p
				className='mb-3 font-sans text-gray-500'
				dangerouslySetInnerHTML={{ __html: smartypants(post.description, 1) }}
			/>
			<small className='mb-8 flex items-center gap-x-1 tabular-nums text-gray-500'>
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
								title={prevPost.title}
								href={prevPost.slug}
							>
								{prevPost.title}
							</Link>
						</div>
					)}
					{nextPost && (
						<div aria-label='Next post' className='w-1/2 text-right font-sans'>
							<span className='mb-0.5 inline-block text-gray-500'>Next</span>
							<Link className='line-clamp-1 font-[450] dark:text-gray-50' href={nextPost.slug}>
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
