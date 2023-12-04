import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./content/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/contentlayer-datapad/**/*.js',
	],
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		fontFamily: {
			sans: [
				['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
				{
					fontFeatureSettings: '"kern", "dlig", "liga", "ss03" on',
				},
			],
			serif: [
				['var(--font-gestura-text)', ...defaultTheme.fontFamily.serif],
				{
					fontFeatureSettings: '"kern", "liga"',
				},
			],
			mono: ['Menlo', ...defaultTheme.fontFamily.mono],
		},
		extend: {
			boxShadow: {
				border: '0 1px 2px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.12)',
				'border-hovered': '0 1px 2px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.22)',
			},
			colors: {
				gray: {
					...colors.neutral,
					1000: '#111',
				},
				accent: {
					DEFAULT: '#fceed2',
				},
			},
		},
	},
	plugins: [typography],
};
export default config;
