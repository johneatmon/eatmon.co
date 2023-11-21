import { Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import 'server-only';

type ViewsTable = {
	slug: string;
	count: number;
};

type Database = {
	views: ViewsTable;
};

const db = new Kysely<Database>({
	dialect: new PlanetScaleDialect({
		host: process.env.DATABASE_HOST,
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
	}),
});

export default db;
