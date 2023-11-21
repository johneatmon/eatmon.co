import { allBlogs } from 'contentlayer/generated';
import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import ViewCounter from '~/app/blog/view-counter';
import { getViewsCount } from '~/lib/metrics';

export const metadata: Metadata = {
	title: 'Blog',
	description: 'Read my thoughts on software development, design, and more.',
};

export default function BlogPage() {
	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<section>
				<Link
					className='group mb-16 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-600 focus:text-gray-600 focus:underline focus:outline-none'
					href='/'
				>
					<ArrowLeftIcon className='inline-block h-4 w-4 transition group-hover:-translate-x-0.5' />
					Index
				</Link>
				<h1 className='mb-8 text-2xl font-semibold tracking-tighter text-gray-100'>Blog</h1>
				{allBlogs
					.sort((a, b) => {
						if (new Date(a.date) > new Date(b.date)) {
							return -1;
						}
						return 1;
					})
					.map((post) => (
						<Link key={post.slug} className='mb-4 flex flex-col space-y-1' href={post.slug}>
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
											<Views slug={post.slug} /> views
										</Suspense>
									</span>
								</div>
							</div>
						</Link>
					))}
			</section>
		</main>
	);
}

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

	return <ViewCounter allViews={views} slug={slug} trackView={false} />;
}
