import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import type { Thing, WithContext } from 'schema-dts';
import { twMerge } from 'tailwind-merge';
import { allBlogs, type Blog } from '~/.contentlayer/generated';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const filteredPosts = allBlogs.filter((post: Blog) => {
	return process.env.NODE_ENV === 'development' || !post.draft;
});

export const parseError = (error: unknown): string => {
	const message = error instanceof Error ? error.message : String(error);

	return message;
};

export const toJsonLd = <T extends Thing>(json: WithContext<T>): string =>
	`<script type="application/ld+json">${JSON.stringify(json, null, 2)}</script>`;
