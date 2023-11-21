import { parseHTML } from 'linkedom';
import { unstable_cache as cache } from 'next/cache';
import Parser from 'rss-parser';
import 'server-only';
import { parseError } from '~/lib/utils';

type CustomFeed = {
	title: string;
	link: string;
	description: string;
	items: CustomItem[];
};

type CustomItem = {
	title: string;
	link: string;
	guid: string;
	pubDate: string;
	'letterboxd:watchedDate': string;
	'letterboxd:rewatch': string;
	'letterboxd:filmTitle': string;
	'letterboxd:filmYear': string;
	description: string;
	'dc:creator': string;
};

const fetchMovies = async (
	count?: number
): Promise<
	{
		title: string;
		link: string;
		date: Date;
		image: string;
	}[]
> => {
	const parser: Parser<CustomFeed, CustomItem> = new Parser({
		customFields: {
			feed: ['title', 'link', 'description', 'items'],
			item: [
				'title',
				'link',
				'guid',
				'pubDate',
				'letterboxd:watchedDate',
				'letterboxd:rewatch',
				'letterboxd:filmTitle',
				'letterboxd:filmYear',
				'description',
				'dc:creator',
			],
		},
	});

	try {
		const response = await fetch('https://letterboxd.com/jmaeatmon/rss/');
		const data = (await response.text()) as string;
		const feed = await parser.parseString(data);

		if (!feed || !response.ok) {
			throw new Error(
				response.statusText ?? response.status ?? "Couldn't parse Letterboxd RSS feed"
			);
		}

		const movies = feed.items.slice(0, count ?? -1).map((movie) => {
			const { document } = parseHTML(movie.description);

			const title = movie['letterboxd:filmTitle'];
			const link = movie.link;
			const date = new Date(movie.pubDate);
			const image =
				document.querySelector('img')?.getAttribute('src') ??
				'https://images.pexels.com/photos/4065183/pexels-photo-4065183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

			return { title, link, date, image };
		});

		return movies;
	} catch (error: unknown) {
		const message = parseError(error);
		throw new Error(message);
	}
};

export default cache(fetchMovies, ['letterboxd'], { revalidate: 60 * 60 * 60 * 24 * 7 });
