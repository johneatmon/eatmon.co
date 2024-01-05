import { ComputedFields, defineDocumentType, makeSource } from 'contentlayer/source-files';
import readingTime from 'reading-time';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import type { Options as RehypeAutoLinkHeadingsOptions } from 'rehype-autolink-headings';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import type { Pluggable } from 'unified';

const rehypePrettyCodeOptions: RehypePrettyCodeOptions = {
	theme: {
		dark: 'github-dark',
		light: 'github-light',
	},
	keepBackground: false,
};

const rehypeAutolinkHeadingsOptions: RehypeAutoLinkHeadingsOptions = {
	properties: {
		className: ['anchor'],
		ariaLabel: 'Link to section',
	},
};

const computedBlogFields: ComputedFields = {
	slug: {
		type: 'string',
		description: 'The slug of the document, used in the URL',
		resolve: (doc) => `/${doc._raw.flattenedPath}`,
	},
	slugAsParams: {
		type: 'string',
		description: 'The slug as a path segment',
		resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
	},
	readingTime: {
		type: 'string',
		description: 'The estimated time to read the document, in minutes',
		resolve: (doc) => readingTime(doc.body.raw).text,
	},
	// toc: {
	// 	type: 'list',
	// 	description: 'The table of contents of the document',
	// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
	// 	resolve: async (doc) => extractTocHeadings(doc.body.raw),
	// },
};

const Blog = defineDocumentType(() => ({
	name: 'Blog',
	filePathPattern: `blog/**/*.mdx`,
	contentType: 'mdx',
	fields: {
		title: { required: true, type: 'string' },
		description: { required: true, type: 'string' },
		date: { required: true, type: 'string' },
		updated: { type: 'string' },
		draft: { type: 'boolean' },
	},
	computedFields: computedBlogFields,
}));

const remarkPlugins = (): Pluggable[] => [remarkGfm as Pluggable, remarkSmartypants as Pluggable];

const source = makeSource({
	contentDirPath: './content',
	documentTypes: [Blog],
	mdx: {
		// @ts-expect-error TS just be trippin'
		remarkPlugins: remarkPlugins(),
		rehypePlugins: [
			rehypeAccessibleEmojis,
			rehypeSlug,
			// @ts-expect-error TS just be trippin'
			[rehypePrettyCode, rehypePrettyCodeOptions],
			[rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
		],
	},
});

export default source;
