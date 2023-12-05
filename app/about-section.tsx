import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HTMLProps } from 'react';
import smartypants from 'smartypants';
import { components } from '~/components/mdx';
import Section from '~/components/section';
import '~/styles/blog.css';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function AboutSection({
	...props
}: HTMLProps<HTMLDivElement> & { readonly children?: never }) {
	const rawContent = fs.readFileSync(path.join(__dirname, `./about.md`), 'utf-8');
	const content = smartypants(rawContent, 1).trim();

	if (!content) {
		return null;
	}

	return (
		<Section title='About' {...props}>
			<div className='prose prose-neutral max-w-2xl dark:prose-invert'>
				<MDXRemote source={content} components={components} />
			</div>
		</Section>
	);
}
