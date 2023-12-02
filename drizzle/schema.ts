import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const views = mysqlTable('views', {
	slug: varchar('slug', { length: 255 }).primaryKey(),
	count: int('count', { unsigned: true }).default(0),
});
