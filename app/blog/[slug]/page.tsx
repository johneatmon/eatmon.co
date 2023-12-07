import { allBlogs } from 'contentlayer/generated';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';
import smartypants from 'smartypants';
import ViewCounter from '~/app/blog/view-counter';
import { Mdx } from '~/components/mdx';
import ReturnLink from '~/components/return-link';
import { getViewsCount } from '~/lib/planetscale';
import { cn } from '~/lib/utils';
import '~/styles/blog.css';

type BlogPostProps = {
	readonly params: {
		slug: string;
	};
};

export const generateMetadata = ({ params }: BlogPostProps): Metadata => {
	const currentPath = params.slug;
	const post = allBlogs
		.filter((post) => (process.env.NODE_ENV === 'development' ? true : !post.draft))
		.find(({ slugAsParams }) => slugAsParams === currentPath);

	if (!post) {
		return {};
	}

	return {
		title: post.title,
		description: post.description,
		// path: `/blog/${post.slug}`,
	};
};

export const generateStaticParams = (): BlogPostProps['params'][] =>
	allBlogs
		.filter((post) => (process.env.NODE_ENV === 'development' ? true : !post.draft))
		.map((post) => ({
			slug: post.slug,
		}));

const BlogPost: FC<BlogPostProps> = ({ params }) => {
	const currentPath = params.slug;
	const post = allBlogs
		.filter((post) => (process.env.NODE_ENV === 'development' ? true : !post.draft))
		.find(({ slugAsParams }) => slugAsParams === currentPath);

	if (!post) {
		notFound();
	}

	const prevPost = allBlogs.at(allBlogs.indexOf(post) - 1) || null;
	const nextPost = allBlogs.at(allBlogs.indexOf(post) + 1) || null;

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
