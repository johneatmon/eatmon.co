import { defineCollection, z } from "astro:content"

const workCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		roles: z.string(),
		published: z.date(),
		modified: z.date().optional(),
		duration: z.object({
			from: z.string(),
			to: z.string(),
		}),
	}),
})

const projectCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		published: z.date(),
		modified: z.date().optional(),
		image: z.object({
			src: z.string(),
			alt: z.string().optional(),
		}),
		roles: z.array(z.string()),
		tools: z.array(z.string()),
		tags: z.array(z.string()),
		duration: z.object({
			from: z.string(),
			to: z.string(),
		}),
		caseStudy: z.boolean().default(false),
	}),
})

export const collections = {
	work: workCollection,
	project: projectCollection,
}
