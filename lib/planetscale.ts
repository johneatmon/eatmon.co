import { connect } from '@planetscale/database';
import { sum } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { unstable_cache as cache } from 'next/cache';
import 'server-only';
import { views } from '~/drizzle/schema';

const connection = connect({
	host: process.env['DATABASE_HOST'],
	username: process.env['DATABASE_USERNAME'],
	password: process.env['DATABASE_PASSWORD'],
});

export const db = drizzle(connection);

export const getTotalBlogViews = cache(
	async () => {
		if (
			!process.env.DATABASE_HOST ||
			!process.env.DATABASE_USERNAME ||
			!process.env.DATABASE_PASSWORD
		) {
			return 0;
		}

		const [data] = await db.select({ count: sum(views.count) }).from(views);
		return Number(data.count);
	},
	['blog-views-total'],
	{
		revalidate: 5,
	}
);

export const getViewsCount = cache(
	async () => {
		return db.select({ slug: views.slug, count: views.count }).from(views);
	},
	['all-views'],
	{
		revalidate: 5,
	}
);
