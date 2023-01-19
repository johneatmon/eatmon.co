export const about = `
	I'm a wearer of many hats.
	<br /><br />
	A generalist product designer, front-end developer, and digital Swiss Army knife, I love solving
	user problems and meeting business objectives. I refine brand, service, and product strategy
	with a broad spectrum of skills.
	<br /><br />
	My BA in English exposed me to the power of storytelling and the value of delivering cohesive
	journeys for diverse audiences. My experience in IT has taught me the value of good CX and has
	demonstrated that filling many roles allows me to solve a wide range of business or customer
	challenges with various constraints. My passion for visual design and web technologies provides
	the creativity and momentum that power my design solutions.
	<br /><br />
	For over 2 years, I've helped shape brand, design direction, and content in the tech industry.
	For nearly 7 years, I've helped refine business processes, overcome workflow obstacles, and empathize
	with unique customer challenges. As a lifelong learner and wearer of many hats, I'm both unafraid
	and equipped to design, develop, strategize, market, write, research, test, edit, or deploy new
	solutions.
	<br /><br />
	After hours, I summit volcanoes, backpack, build LEGO sets, brew French press or Chemex coffee, make music in Ableton, read, and trial gluten-free recipes.
`

export const work = `
	2+ years of experience in design and development. Nearly 7 years of experience delivering business value and improving customer experience in the tech industry.
`

type Tool = {
	label: string
	tag: string
	icon: string
	href: string | URL
}

export const tools: Tool[] = [
	{
		label: "Astro",
		href: "https://astro.build",
		tag: "Development",
		icon: "astro",
	},
	{
		label: "Netlify",
		href: "https://netlify.app/",
		tag: "Development",
		icon: "netlify",
	},
	{
		label: "VS Code",
		href: "https://code.visualstudio.com/",
		tag: "Development",
		icon: "vscode",
	},
	{
		label: "Figma",
		href: "https://www.figma.com/",
		tag: "Design",
		icon: "figma",
	},
	{
		label: "Framer",
		href: "https://www.framer.com/",
		tag: "Design",
		icon: "framer",
	},
	{
		label: "Sketch",
		href: "https://www.sketch.com/",
		tag: "Design",
		icon: "sketch",
	},
	{
		label: "Notion",
		href: "https://www.notion.so/",
		tag: "Productivity",
		icon: "notion",
	},
	{
		label: "Obsidian",
		href: "https://obsidian.md/",
		tag: "Productivity",
		icon: "obsidian",
	},
	{
		label: "Raycast",
		href: "https://www.raycast.com/",
		tag: "Productivity",
		icon: "raycast",
	},
].sort((a, b) => a.tag.localeCompare(b.tag) || a.label.localeCompare(b.label)) // double sort, bitches!!
