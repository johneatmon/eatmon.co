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

		return config;
	},
};

const withContentlayer = createContentlayerPlugin({});

const config = withPlaiceholder(withContentlayer(nextConfig));

export default config;
