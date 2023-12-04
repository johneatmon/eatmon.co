import { MDXRemote } from 'next-mdx-remote/rsc';
import smartypants from 'smartypants';
import { components } from '~/components/mdx';
import ReturnLink from '~/components/return-link';
import '~/styles/blog.css';

export default async function ColophonPage() {
	const rawContent = await fetch(
		`https://raw.githubusercontent.com/johneatmon/eatmon.co/v2/COLOPHON.md`
	);
	const content = smartypants(await rawContent.text(), 1).trim();

	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<ReturnLink href='/'>Index</ReturnLink>
			<div className='prose prose-zinc max-w-2xl text-gray-400 dark:prose-invert'>
				<MDXRemote source={content} components={components} />
			</div>
		</main>
	);
}
