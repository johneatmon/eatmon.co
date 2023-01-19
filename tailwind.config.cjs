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
			animation: {
				comeInOut: "comeInOut 700ms forwards",
				spinSparkles: "spin 1000ms linear",
			},
			fontFamily: {
				display: ["Hatton", ...defaultTheme.fontFamily.sans],
				sans: ["Söhne", ...defaultTheme.fontFamily.sans],
				serif: ["Nuances", ...defaultTheme.fontFamily.serif],
			},
			keyframes: {
				comeInOut: {
					"0%, 100%": { transform: "scale(0)" },
					"50%": { transform: "scale(1)" },
				},
				spin: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(180deg)" },
				},
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
