import type { Metadata } from 'next';
import { Suspense, type FC } from 'react';
import BlogPost from '~/components/blog-post';
import ReturnLink from '~/components/return-link';
import Section from '~/components/section';
import { getTotalBlogViews } from '~/lib/db';
import { filteredPosts } from '~/lib/utils';

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Read my thoughts on development, technology, and typography.',
};

export default async function BlogPage() {
	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<ReturnLink href='/'>Index</ReturnLink>
			<Section>
				<h1 className='mb-4 text-2xl font-semibold text-gray-950 dark:text-gray-50'>Blog</h1>
				<p className='mb-8'>
					{filteredPosts.length.toLocaleString()} posts
					<Suspense fallback={<span className='inline-block h-5' />}>
						{' '}
						&middot; <TotalViews />
					</Suspense>
				</p>
				<ul role='list' className='flex flex-col gap-4'>
					{filteredPosts
						.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
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

const TotalViews: FC = async () => {
	const totalBlogViews = await getTotalBlogViews();

	if (!totalBlogViews) {
		return null;
	}

	return <span>{totalBlogViews.toLocaleString()} views</span>;
};
