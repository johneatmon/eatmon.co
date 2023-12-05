import withPlaiceholder from '@plaiceholder/next';
import { createContentlayerPlugin } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
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
