import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const views = pgTable('views', {
	slug: varchar('slug', { length: 255 }).primaryKey(),
	count: integer('count').default(0),
});
