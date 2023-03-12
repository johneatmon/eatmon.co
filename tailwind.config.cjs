// eslint-disable-next-line
const defaultTheme = require("tailwindcss/defaultTheme")
// eslint-disable-next-line
const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,svg,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: ["class", '[data-mode="dark"]'],
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		colors: (theme) => ({
			transparent: "transparent",
			current: "currentColor",
			black: colors.black,
			white: colors.white,
			gray: {
				...theme.colors.zinc,
				1000: "#050505",
			},
			indigo: colors.indigo,
			purple: colors.purple,
			emerald: colors.emerald,
		}),
		extend: {
			animation: {
				comeInOut: "comeInOut 700ms forwards",
				disco: "disco 4s linear infinite",
				spinSparkles: "sparkleSpin 1000ms linear",
				// Toast
				"toast-hide": "toast-hide 100ms ease-in forwards",
				"toast-slide-in-right": "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				"toast-slide-in-bottom": "toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				"toast-swipe-out-x": "toast-swipe-out-x 100ms ease-out forwards",
				"toast-swipe-out-y": "toast-swipe-out-y 100ms ease-out forwards",
			},
			backgroundImage: (theme) => ({
				"gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
				"gradient-purple": `linear-gradient(to right, 
					${theme("colors.purple.700/0")}, 
					${theme("colors.purple.700/40")}, 
					${theme("colors.indigo.500/40")}, 
					${theme("colors.indigo.500/0")}
				)`,
				"gradient-purple-dark": `linear-gradient(to right, 
					${theme("colors.purple.400/0")}, 
					${theme("colors.purple.400/40")}, 
					${theme("colors.indigo.400/40")}, 
					${theme("colors.indigo.400/0")}
				)`,
			}),
			fontFamily: {
				sans: ["Söhne", "Söhne\\ fallback", ...defaultTheme.fontFamily.sans],
				serif: ["Blanco", "Blanco\\ fallback", ...defaultTheme.fontFamily.serif],
			},
			keyframes: {
				comeInOut: {
					"0%, 100%": { transform: "scale(0)" },
					"50%": { transform: "scale(1)" },
				},
				disco: {
					"0%": { transform: "translateY(-50%) rotate(0deg)" },
					"100%": { transform: "translateY(-50%) rotate(360deg)" },
				},
				sparkleSpin: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(180deg)" },
				},
				// Toast
				"toast-hide": {
					"0%": { opacity: 1 },
					"100%": { opacity: 0 },
				},
				"toast-slide-in-right": {
					"0%": { transform: `translateX(calc(100% + 1rem))` },
					"100%": { transform: "translateX(0)" },
				},
				"toast-slide-in-bottom": {
					"0%": { transform: `translateY(calc(100% + 1rem))` },
					"100%": { transform: "translateY(0)" },
				},
				"toast-swipe-out-x": {
					"0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
					"100%": {
						transform: `translateX(calc(100% + 1rem))`,
					},
				},
				"toast-swipe-out-y": {
					"0%": { transform: "translateY(var(--radix-toast-swipe-end-y))" },
					"100%": {
						transform: `translateY(calc(100% + 1rem))`,
					},
				},
			},
			lineHeight: {
				tighter: "1.1",
			},
		},
	},
	plugins: [
		require("@headlessui/tailwindcss"),
		require("@tailwindcss/line-clamp"),
		require("@tailwindcss/typography"),
		require("tailwindcss-radix"),
	],
}
