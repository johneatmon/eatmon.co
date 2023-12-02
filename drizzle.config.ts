import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config({ path: '.env.local' });

// TODO: Doesn't work, SSL issue
export default {
	out: './drizzle/migrations',
	schema: './drizzle/schema.ts',
	driver: 'mysql2',
	dbCredentials: {
		uri: process.env.DATABASE_URL!,
	},
} satisfies Config;
