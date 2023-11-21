import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
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
					fontFeatureSettings: '"kern", "dlig", "liga", "ss03"',
				},
			],
			script: 'Monaspace\\ Radon\\ Var, cursive',
			serif: ['Newsreader', ...defaultTheme.fontFamily.serif],
			mono: ['Menlo', ...defaultTheme.fontFamily.mono],
		},
		extend: {
			backgroundImage: {
				'eased-gradient':
					'linear-gradient(90deg, hsl(0deg 0% 0%) 0%, hsl(240deg 45% 1%) 21%, hsl(240deg 28% 2%) 30%, hsl(240deg 20% 3%) 39%, hsl(240deg 15% 4%) 46%, hsl(240deg 12% 5%) 54%, hsl(240deg 9% 5%) 61%, hsl(240deg 8% 6%) 69%, hsl(240deg 6% 6%) 79%, hsl(240deg 6% 7%) 100%)',
			},
			boxShadow: {
				border: '0 1px 2px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.12)',
				'border-hovered': '0 1px 2px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.22)',
			},
			colors: {
				gray: {
					...colors.zinc,
					1000: 'rgb(17,17,19)',
					1100: 'rgb(10,10,11)',
				},
				accent: {
					DEFAULT: '#FCEED2',
				},
			},
		},
	},
	plugins: [typography],
};
export default config;
