'use client';

import { useEffect } from 'react';
import { increment } from '~/lib/actions';

export default function ViewCounter({
	slug,
	allViews,
	trackView,
}: {
	slug: string;
	allViews: {
		slug: string;
		count: number | null;
	}[];
	trackView?: boolean;
}) {
	const viewsForSlug = allViews && allViews.find((view) => view.slug === slug);
	const number = new Number(viewsForSlug?.count || 0);

	useEffect(() => {
		if (trackView) {
			increment(slug);
		}
	}, []);

	return <span>{number.toLocaleString()}</span>;
}
