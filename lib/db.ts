import { sum } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { unstable_cache as cache } from 'next/cache';
import postgres from 'postgres';
import 'server-only';
import { views } from '~/drizzle/schema';

const pgClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle(pgClient);

export const getTotalBlogViews = cache(
	async () => {
		if (!process.env.DATABASE_URL) {
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
		if (!process.env.DATABASE_URL) {
			return [];
		}

		return db.select({ slug: views.slug, count: views.count }).from(views);
	},
	['all-views'],
	{
		revalidate: 5,
	}
);
