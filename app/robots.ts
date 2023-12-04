export default function robots() {
	return {
		rules: [
			{
				userAgent: 'CCBot',
				Disallow: '/',
			},
			{
				userAgent: 'GPTBot',
				Disallow: '/',
			},
			{
				userAgent: 'Google-Extended',
				Disallow: '/',
			},
			{
				userAgent: '*',
			},
		],
		sitemap: new URL('/sitemap.xml', process.env.NEXT_PUBLIC_VERCEL_URL).href,
		host: process.env.NEXT_PUBLIC_VERCEL_URL,
	};
}
