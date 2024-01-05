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
	],
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		fontFamily: {
			sans: [
				['var(--font-uncut-sans)', ...defaultTheme.fontFamily.sans],
				{
					fontFeatureSettings: '"kern", "liga", "ss02", "ss05"',
				},
			],
			mono: [
				['var(--font-commit-mono)', 'Menlo', ...defaultTheme.fontFamily.mono],
				{
					fontFeatureSettings:
						'"ss01", "ss02", "ss03", "ss04", "ss05", "cv02", "cv03", "cv07", "cv10", "cv11"',
				},
			],
		},
		extend: {
			animation: {
				overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
				contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
			},
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
			keyframes: {
				overlayShow: {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				contentShow: {
					from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
					to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
				},
			},
		},
	},
	plugins: [typography],
};
export default config;
