import { allBlogs } from 'contentlayer/generated';
import type { Metadata } from 'next';
import BlogPost from '~/components/blog-post';
import ReturnLink from '~/components/return-link';
import Section from '~/components/section';
import { getTotalBlogViews } from '~/lib/planetscale';

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Read my thoughts on development, technology, and typography.',
};

export default async function BlogPage() {
	const totalBlogViews = await getTotalBlogViews();

	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<ReturnLink href='/'>Index</ReturnLink>
			<Section>
				<h1 className='mb-4 text-2xl font-semibold text-gray-950 dark:text-gray-50'>Blog</h1>
				<p className='mb-8'>
					{allBlogs.length.toLocaleString()} posts &middot; {totalBlogViews.toLocaleString()} views
				</p>
				<ul role='list' className='flex flex-col gap-4'>
					{allBlogs
						.filter((post) => (process.env.NODE_ENV === 'development' ? true : !post.draft))
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
