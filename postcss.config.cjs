const lib = process.env.npm_lifecycle_event;
// todo: inline MQs for 'lib:all' when it's supported better
const inlineMediaQueries = lib === 'lib:media' || lib === 'lib:supports';

module.exports = {
	plugins: {
		autoprefixer: {},
		'tailwindcss/nesting': 'postcss-nesting',
		tailwindcss: {},
		'postcss-preset-env': {
			stage: 1,
			features: {
				'custom-media-queries': { preserve: inlineMediaQueries },
				'nesting-rules': false,
			},
		},
	},
};
