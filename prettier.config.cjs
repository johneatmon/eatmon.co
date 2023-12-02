/** @type {import('prettier').Options} */
const config = {
	plugins: ['prettier-plugin-tailwindcss'],
	tailwindFunctions: ['clsx', 'cn'],
	singleQuote: true,
	jsxSingleQuote: true,
	trailingComma: 'es5',
	useTabs: true,
	printWidth: 100,
	overrides: [
		{
			files: ['*.json', '*.md', '*.mdx'],
			options: {
				useTabs: false,
			},
		},
	],
};

module.exports = config;
