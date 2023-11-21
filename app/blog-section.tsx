import Link from 'next/link';
import { Suspense } from 'react';
import { allBlogs } from '~/.contentlayer/generated';
import ViewCounter from '~/app/blog/view-counter';
import Section from '~/components/section';
import { getViewsCount } from '~/lib/metrics';

const BlogSection = async ({ count = -1 }: { count?: number }) => {
	const allViews = await getViewsCount();

	return (
		<Section title='Recent Posts'>
			<ul role='list'>
				{allBlogs
					.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
					.slice(0, count)
					.map((post) => (
						<li key={post.slug}>
							<Link className='mb-4 flex flex-col space-y-1' href={post.slug}>
								<div className='flex w-full flex-col gap-1'>
									<p className='tracking-tight text-neutral-900 dark:text-neutral-100'>
										{post.title}
									</p>
									<div className='flex items-center gap-1.5 text-sm text-gray-600'>
										<time dateTime={new Date(post.date).toISOString()}>
											{new Date(post.date).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</time>
										&middot;
										<span>
											<Suspense fallback={<span className='inline-block h-6' />}>
												<ViewCounter allViews={allViews} slug={post.slug} trackView={false} /> views
											</Suspense>
										</span>
									</div>
								</div>
							</Link>
						</li>
					))}
				<li className='text-gray-400'>
					Read more{' '}
					<a href='/blog' className='text-gray-50'>
						blog posts
					</a>
				</li>
			</ul>
		</Section>
	);
};
export default BlogSection;
