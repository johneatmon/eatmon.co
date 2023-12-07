'use client';

import { useEffect } from 'react';
import { increment } from '~/lib/actions';

export default function ViewCounter({
	slug,
	views,
	track = false,
}: {
	slug: string;
	views: {
		slug: string;
		count: number | null;
	}[];
	track?: boolean;
}) {
	const viewsForSlug = views && views.find((view) => view.slug === slug);
	const number = new Number(viewsForSlug?.count || 0);

	useEffect(() => {
		if (track) {
			increment(slug);
		}
	}, [track, slug]);

	return <span>{number.toLocaleString()} views</span>;
}
