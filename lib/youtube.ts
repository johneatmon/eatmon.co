// import { unstable_cache } from "next/cache";
import { parseHTML } from 'linkedom';

// export const getRecentPlays = unstable_cache(
// 	async () => {
// 		if (!process.env.YOUTUBE_MUSIC_URL) {
// 			return;
// 		}
// 		const url = new URL(process.env.YOUTUBE_MUSIC_URL).href

// 		const response = await fetch(url);
// 		const data = (await response.text()) as string;
// 		const { document } = parseHTML(data);
// 	},
// 	['recent-plays'],
// 	{
// 		revalidate: 60 * 60 * 24, // Every day
// 	}
// )

export const getRecentPlays = async () => {
	if (!process.env.YOUTUBE_MUSIC_URL) {
		return;
	}
	const url = new URL(process.env.YOUTUBE_MUSIC_URL).href;

	const response = await fetch(url);
	const data = (await response.text()) as string;
	const { document } = parseHTML(data);

	if (!document) {
		throw new Error("Couldn't parse YouTube Music page");
	}

	const plays = document.querySelector('div#content');

	return plays;
};
