import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { allBlogs } from 'contentlayer/generated';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';
import Balancer from 'react-wrap-balancer';
import smartypants from 'smartypants';
import ViewCounter from '~/app/blog/view-counter';
import { Mdx } from '~/components/mdx';
import { getViewsCount } from '~/lib/metrics';
import { cn } from '~/lib/utils';
import '~/styles/blog.css';

type BlogPostProps = {
	readonly params: {
		slug: string;
	};
};

// export const dynamic = 'force-dynamic';

export const generateMetadata = ({ params }: BlogPostProps): Metadata => {
	const currentPath = params.slug;
	const post = allBlogs
		.filter((post) => !post.draft)
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
		.filter((post) => !post.draft)
		.map((post) => ({
			slug: post.slug,
		}));

const BlogPost: FC<BlogPostProps> = ({ params }) => {
	const currentPath = params.slug;
	const post = allBlogs
		.filter((post) => !post.draft)
		.find(({ slugAsParams }) => slugAsParams === currentPath);

	if (!post) {
		notFound();
	}

	const prevPost = allBlogs.at(allBlogs.indexOf(post) - 1) || null;
	const nextPost = allBlogs.at(allBlogs.indexOf(post) + 1) || null;

	return (
		<main className='mx-auto flex max-w-2xl flex-col px-4 pb-24 pt-[128px]'>
			<Link
				className='group mb-16 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-600 focus:text-gray-600 focus:underline focus:outline-none'
				href='/blog'
			>
				<ArrowLeftIcon className='inline-block h-4 w-4 transition group-hover:-translate-x-0.5 group-hover:text-gray-600' />
				Back to Blog
			</Link>
			<h1 className='mb-4 scroll-m-20 text-4xl font-bold leading-[1.1em] tracking-tight text-gray-950 dark:text-gray-50'>
				<Balancer>{post.title}</Balancer>
			</h1>
			<p
				className='mb-3 text-gray-500 dark:text-gray-400'
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
				&#9585;
				<Suspense fallback={<span className='inline-block h-5' />}>
					<Views slug={post.slug} /> views
				</Suspense>
			</small>
			<Mdx code={post.body.code} />
			{(prevPost || nextPost) && (
				<footer
					className={cn(
						'mt-10 flex items-center gap-1 border-t border-gray-800 py-10 text-sm',
						nextPost && !prevPost && 'justify-end'
					)}
				>
					{prevPost && (
						<div aria-label='Previous post' className='w-1/2'>
							<span className='mb-0.5 inline-block text-gray-500'>Previous</span>
							<Link
								className='line-clamp-1 font-[450] text-gray-50'
								title={prevPost.title}
								href={prevPost.slug}
							>
								{prevPost.title}
							</Link>
						</div>
					)}
					{nextPost && (
						<div aria-label='Next post' className='w-1/2 text-right'>
							<span className='mb-0.5 inline-block text-gray-500'>Next</span>
							<Link className='line-clamp-1 font-[450] text-gray-50' href={nextPost.slug}>
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
	let views;
	try {
		views = await getViewsCount();
	} catch (error) {
		console.error(error);
	}

	if (!views) {
		return null;
	}

	return (
		<ViewCounter allViews={views} slug={slug} trackView={process.env.NODE_ENV === 'production'} />
	);
}

export default BlogPost;
