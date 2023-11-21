import { ComputedFields, defineDocumentType, makeSource } from 'contentlayer/source-files';
import fs from 'node:fs';
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

const vesper = JSON.parse(
	fs.readFileSync(new URL('../../../theme/vesper.json', import.meta.url), 'utf-8')
);

const rehypePrettyCodeOptions: Partial<RehypePrettyCodeOptions> = {
	theme: {
		dark: vesper,
		light: 'github-light',
	},
	keepBackground: false,
	onVisitLine(node) {
		// Prevent lines from collapsing in `display: grid` mode, and
		// allow empty lines to be copy/pasted
		if (node.children.length === 0) {
			node.children = [{ type: 'text', value: ' ' }];
		}
		node.properties.className?.push('syntax-line');
	},
	onVisitHighlightedLine(node) {
		node.properties.className?.push('syntax-line--highlighted');
	},
	onVisitHighlightedChars(node) {
		node.properties.className = ['syntax-word--highlighted'];
	},
	tokensMap: {
		// VScode command palette: Inspect Editor Tokens and Scopes
		// https://github.com/Binaryify/OneDark-Pro/blob/47c66a2f2d3e5c85490e1aaad96f5fab3293b091/themes/OneDark-Pro.json
		fn: 'entity.name.function',
		objKey: 'meta.object-literal.key',
	},
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
	// structuredData: {
	// 	resolve: (doc) => ({
	// 		'@context': 'https://schema.org',
	// 		'@type': 'BlogPosting',
	// 		author: {
	// 			'@type': 'Person',
	// 			name: 'Cristian Crețu',
	// 		},
	// 		dateModified: doc.publishedAt,
	// 		datePublished: doc.publishedAt,
	// 		description: doc.summary,
	// 		headline: doc.title,
	// 		image: doc.image ? `https://cretu.dev${doc.image}` : `https://cretu.dev/static/images/og.png`,
	// 		url: `https://cretu.dev/writing/${doc._raw.flattenedPath}`,
	// 	}),
	// 	type: 'json',
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
			[rehypePrettyCode, rehypePrettyCodeOptions],
			[rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
		],
	},
});

export default source;
