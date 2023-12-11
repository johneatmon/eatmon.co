'use server';

import { eq } from 'drizzle-orm';
import { views } from '~/drizzle/schema';
import { db } from '~/lib/planetscale';

export async function increment(slug: string) {
	const data = await db.select({ count: views.count }).from(views).where(eq(views.slug, slug));
	const blogViews = !data.length ? 0 : Number(data[0].count);

	await db
		.insert(views)
		.values({ slug, count: 1 })
		.onDuplicateKeyUpdate({ set: { count: blogViews + 1 } });

	return;
}
