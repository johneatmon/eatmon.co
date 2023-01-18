const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "media",
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		extend: {
			fontFamily: {
				display: ["Hatton", ...defaultTheme.fontFamily.sans],
				sans: ["Söhne", ...defaultTheme.fontFamily.sans],
				serif: ["Nuances\\ Normal", ...defaultTheme.fontFamily.serif],
			},
			lineHeight: {
				tighter: "1.1",
			},
		},
	},
	plugins: [
		require("windy-radix-palette"),
		require("@tailwindcss/typography"),
		require("windy-radix-typography"),
		require("tailwindcss-radix"),
	],
}
