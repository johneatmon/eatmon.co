import glimpse from "@beskar-labs/glimpse/server"
import type { APIRoute } from "astro"

const headers = {
	"content-type": "application/json",
}

export const post: APIRoute = async ({ request }): Promise<Response> => {
	const { url } = (await request.json()) as { url?: string }

	console.log(url)

	if (!url) {
		return new Response(JSON.stringify({}), { status: 400, headers })
	}

	const data = await glimpse(url)
	console.log(data)

	if (!data) {
		return new Response(JSON.stringify(data), { status: 200, headers })
	} else {
		return new Response(JSON.stringify({}), { status: 500, headers })
	}
}
