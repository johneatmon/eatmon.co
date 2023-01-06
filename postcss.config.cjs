const lib = process.env.npm_lifecycle_event

const inlineMediaQueries = lib === "lib:media" || lib === "lib:supports"
// todo: inline MQs for 'lib:all' when it's supported better

module.exports = {
	plugins: {
		"tailwindcss/nesting": "postcss-nesting",
		tailwindcss: {
			config: require("path").join(__dirname, "tailwind.config.cjs"),
		},
		"postcss-preset-env": {
			stage: 1,
			features: {
				"custom-media-queries": { preserve: inlineMediaQueries },
				"nesting-rules": false,
			},
		},
	},
}
