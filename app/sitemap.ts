import { filteredPosts } from '~/lib/utils';

export default async function sitemap() {
	const blogs = filteredPosts.map((post) => ({
		url: new URL(`/blog/${post.slug}`, process.env.NEXT_PUBLIC_VERCEL_URL).href,
		lastModified: post.updated || post.date,
	}));

	const routes = ['', '/blog', '/colophon'].map((route) => ({
		url: new URL(route, process.env.NEXT_PUBLIC_VERCEL_URL).href,
		lastModified: new Date().toISOString().split('T')[0],
	}));

	return [...routes, ...blogs];
}
