import { allBlogs } from 'contentlayer/generated';
import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import BlogPost from '~/components/blog-post';
import Section from '~/components/section';
import { getTotalBlogViews } from '~/lib/planetscale';

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Read my thoughts on software development, design, and more.',
};

export default async function BlogPage() {
	const totalBlogViews = await getTotalBlogViews();

	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<Link
				className='group mb-16 inline-flex items-center gap-1 font-sans text-sm text-gray-500 no-underline transition-colors hover:text-gray-600 focus:text-gray-600 focus:underline focus:outline-none'
				href='/'
			>
				<ArrowLeftIcon className='inline-block h-4 w-4 transition group-hover:-translate-x-0.5' />
				Index
			</Link>
			<Section>
				<h1 className='mb-6 text-2xl font-semibold text-gray-50'>Blog</h1>
				<p className='mb-8'>
					{totalBlogViews.toLocaleString()} views &middot; {allBlogs.length} posts
				</p>
				<ul role='list' className='flex flex-col gap-3'>
					{allBlogs
						.sort((a, b) => {
							if (new Date(a.date) > new Date(b.date)) {
								return -1;
							}
							return 1;
						})
						.map((post) => (
							<li key={post.slug}>
								<BlogPost {...post} />
							</li>
						))}
				</ul>
			</Section>
		</main>
	);
}
