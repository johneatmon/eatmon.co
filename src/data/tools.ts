type Tool = {
	name: string
	href?: string
	icon?: string
	category: "Design" | "Development" | "Services" | "Apps"
	featured?: boolean
	learning?: boolean
}

export const TOOLS: Tool[] = [
	// Design
	{
		name: "Figma",
		icon: "figma",
		href: "https://www.figma.com/",
		category: "Design",
		featured: true,
	},
	{
		name: "Adobe Photoshop",
		icon: "photoshop",
		category: "Design",
	},
	{
		name: "Adobe Illustrator",
		icon: "illustrator",
		category: "Design",
	},
	{
		name: "Adobe InDesign",
		icon: "indesign",
		category: "Design",
	},
	{
		name: "Adobe XD",
		icon: "xd",
		category: "Design",
	},
	{
		name: "Framer",
		icon: "framer",
		href: "https://www.framer.com/",
		category: "Design",
		learning: true,
		featured: true,
	},
	{
		name: "Sketch",
		icon: "sketch",
		href: "https://www.sketch.com/",
		category: "Design",
		featured: true,
	},
	{
		name: "Rive App",
		icon: "",
		href: "https://rive.app/",
		category: "Design",
		learning: true,
	},
	{
		name: "Spline",
		icon: "",
		href: "https://spline.design/",
		category: "Design",
		learning: true,
	},
	// Dev
	{
		name: "HTML",
		icon: "html",
		category: "Development",
	},
	{
		name: "CSS",
		icon: "css",
		category: "Development",
	},
	{
		name: "SCSS/SASS",
		icon: "scss",
		category: "Development",
	},
	{
		name: "Tailwind CSS",
		icon: "tailwindcss",
		href: "https://tailwindcss.com/",
		category: "Development",
	},
	{
		name: "JavaScript",
		icon: "js",
		category: "Development",
	},
	{
		name: "TypeScript",
		icon: "ts",
		category: "Development",
		learning: true,
	},
	{
		name: "React",
		icon: "react",
		href: "https://beta.reactjs.org/",
		category: "Development",
	},
	{
		name: "Astro",
		icon: "astro",
		href: "https://astro.build",
		category: "Development",
		featured: true,
	},
	{
		name: "Next.js",
		icon: "nextjs",
		href: "https://nextjs.org/",
		category: "Development",
		learning: true,
	},
	// Services
	{
		name: "Vercel",
		icon: "vercel",
		href: "https://vercel.com/",
		category: "Services",
	},
	{
		name: "Netlify",
		icon: "netlify",
		href: "https://netlify.app/",
		category: "Services",
		featured: true,
	},
	{
		name: "Cloudflare Images",
		icon: "cloudflare",
		href: "https://www.cloudflare.com/products/cloudflare-images/",
		category: "Services",
	},
	{
		name: "GitHub",
		icon: "github",
		href: "https://github.com/",
		category: "Services",
	},

	{
		name: "Notion",
		icon: "notion",
		href: "https://www.notion.so/",
		category: "Services",
		featured: true,
	},
	{
		name: "Loom",
		icon: "loom",
		href: "https://www.loom.com/",
		category: "Services",
	},
	{
		name: "Felt",
		href: "https://felt.com/",
		category: "Services",
	},
	{
		name: "Plausible Analytics",
		href: "https://plausible.io/",
		category: "Services",
	},
	// Apps
	{
		name: "VS Code",
		icon: "vscode",
		href: "https://code.visualstudio.com/",
		category: "Apps",
		featured: true,
	},
	{
		name: "Obsidian",
		icon: "obsidian",
		href: "https://obsidian.md/",
		category: "Apps",
		featured: true,
	},
	{
		name: "Raycast",
		icon: "raycast",
		href: "https://www.raycast.com/",
		category: "Apps",
		featured: true,
	},
	{
		name: "CleanShot X",
		icon: "",
		href: "https://cleanshot.com/",
		category: "Apps",
	},
	{
		name: "Ableton Live",
		icon: "",
		href: "https://www.ableton.com/en/live/",
		category: "Apps",
		learning: true,
	},
]
