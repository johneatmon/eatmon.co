import Link from 'next/link';
import { Suspense } from 'react';
import ViewCounter from '~/app/blog/view-counter';
import { getViewsCount } from '~/lib/planetscale';

export default function BlogPost({
	slug,
	title,
	date,
}: {
	slug: string;
	title: string;
	date: string;
}) {
	return (
		<div className='flex w-full flex-col gap-1'>
			<Link key={slug} href={slug}>
				<h3 className='font-medium text-gray-900 dark:text-gray-50'>{title}</h3>
			</Link>
			<div className='flex items-center gap-1.5 text-xs text-gray-600'>
				<time dateTime={new Date(date).toISOString()}>
					{new Date(date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})}
				</time>
				&middot;
				<span>
					<Suspense fallback={<span className='inline-block h-[19px]' />}>
						<Views slug={slug} /> views
					</Suspense>
				</span>
			</div>
		</div>
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
