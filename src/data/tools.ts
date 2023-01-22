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
		category: "Design",
		learning: true,
	},
	{
		name: "Spline",
		icon: "",
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
	},
	{
		name: "React",
		icon: "react",
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
		category: "Development",
		learning: true,
	},
	// Services
	{
		name: "Vercel",
		icon: "vercel",
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
		category: "Services",
	},
	{
		name: "GitHub",
		icon: "github",
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
		category: "Services",
	},
	{
		name: "Felt",
		category: "Services",
	},
	{
		name: "Plausible Analytics",
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
		category: "Apps",
	},
	{
		name: "Ableton Live",
		icon: "",
		category: "Apps",
		learning: true,
	},
	// Gear
]
