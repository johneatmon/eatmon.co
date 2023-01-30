export const TWITTER = "@johneatmon_"
export const EMAIL = "john@eatmon.co"

type SocialLink = {
	label: string
	href: string | URL
	icon: string
	rel?: string
}

export const SOCIALS: SocialLink[] = [
	{
		label: "Twitter",
		href: `https://twitter.com/${TWITTER.slice(1, TWITTER.length)}`,
		icon: "bi:twitter",
	},
	{
		label: "Dribbble",
		href: "https://dribbble.com/johneatmon",
		icon: "bi:dribbble",
	},
	{
		label: "GitHub",
		href: "https://github.com/johneatmon",
		icon: "bi:github",
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/in/johneatmon",
		icon: "bi:linkedin",
	},
	{
		label: "Mastodon",
		href: "https://mastodon.design/@jm",
		icon: "bi:mastodon",
		rel: "me",
	},
	{
		label: "ReadCV",
		href: "https://read.cv/johneatmon",
		icon: "readcv",
	},
	{
		label: "Email",
		href: `mailto:${EMAIL}?subject=Hello!`,
		icon: "bi:send",
	},
].sort((a, b) => a.label.localeCompare(b.label))
