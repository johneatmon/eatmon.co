import withPlaiceholder from '@plaiceholder/next';
import { createContentlayerPlugin } from 'next-contentlayer';
import { createSecureHeaders } from 'next-secure-headers';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	env: {
		NEXT_TELEMETRY_DISABLED: '1',
	},
	experimental: {
		serverComponentsExternalPackages: ['linkedom'],
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'eatmon.co',
				pathname: '/**/*',
			},
			{
				protocol: 'https',
				hostname: 'binsta.dev',
				pathname: '/**/*',
			},
			{
				protocol: 'https',
				hostname: 'a.ltrbxd.com',
				pathname: '/resized/**/*',
			},
			{
				protocol: 'https',
				hostname: 'assets.literal.club',
				pathname: '/**/*',
			},
		],
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: createSecureHeaders({
					forceHTTPSRedirect: [true, { maxAge: 63072000, includeSubDomains: true, preload: true }],
				}),
			},
		];
	},
	async redirects() {
		return [
			{
				source: '/github',
				destination: 'https://github.com/johneatmon',
				permanent: true,
			},
			{
				source: '/x',
				destination: 'https://twitter.com/johneatmon_',
				permanent: true,
			},
			{
				source: '/cv',
				destination: 'https://read.cv/johneatmon',
				permanent: true,
			},
			{
				source: '/work/:slug*',
				destination: 'https://read.cv/johneatmon',
				permanent: false,
			},
			{
				source: '/project/:slug*',
				destination: 'https://read.cv/johneatmon/npsVXnwnPLc03Cfs6863',
				permanent: false,
			},
			{
				source: '/about',
				destination: '/',
				permanent: false,
			},
			{
				source: '/about/colophon',
				destination: '/colophon',
				permanent: true,
			},
			{
				source: '/about/tools',
				destination: '/blog/things-i-use',
				permanent: true,
			},
		];
	},
	webpack: (config) => {
		config.infrastructureLogging = {
			level: 'error',
		};
		const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));
		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
				use: ['@svgr/webpack'],
			}
		);
		fileLoaderRule.exclude = /\.svg$/i;

		return config;
	},
};

const withContentlayer = createContentlayerPlugin({});

const config = withPlaiceholder(withContentlayer(nextConfig));

export default config;
