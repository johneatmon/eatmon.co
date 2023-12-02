import { getTweets } from '~/lib/tweets';

export default async function TwitterPage() {
	const tweets = await getTweets();
	console.log('tweets', JSON.stringify(tweets, null, 2));

	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<h1>Twitter</h1>
		</main>
	);
}
