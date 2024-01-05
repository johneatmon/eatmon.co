import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import smartypants from 'smartypants';
import { components } from '~/components/mdx';
import ReturnLink from '~/components/return-link';
import '~/styles/blog.css';

export default function ColophonPage() {
	const md = getMarkdown();

	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<ReturnLink href='/'>Index</ReturnLink>
			<div className='prose prose-zinc max-w-2xl text-gray-400 dark:prose-invert'>
				<MDXRemote source={md.content} components={components} />
			</div>
		</main>
	);
}

const getMarkdown = cache(() => {
	const rawContent = fs.readFileSync(path.join(process.cwd(), `./colophon.md`), 'utf-8');
	const content = smartypants(rawContent, 1).trim();

	return matter(content);
});
