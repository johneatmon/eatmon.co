// import glimpse from "https://esm.sh/v102/@haydenbleasel/glimpse@2.0.2/deno/server.js"
import type { Context } from "https://edge.netlify.com"

// import parseError from '../../utils/parseError';

const headers = {
	"content-type": "application/json",
}

// export const config = {
// 	runtime: "experimental-edge",
// }

export default async (req: Request, context: Context): Promise<Response> => {
	const penis = await context.json()

	console.log(penis)

	return penis
	// const { url } = (await req.json()) as { url?: string }

	// console.log(url)
	// if (!url) {
	// 	return new Response(JSON.stringify({}), { status: 400, headers })
	// }

	// try {
	// 	const data = await glimpse(url)

	// 	console.log(data)

	// 	return new Response(JSON.stringify(data), { status: 200, headers })
	// } catch {
	// 	return new Response(JSON.stringify({}), { status: 500, headers })
	// }
}

// export default handler
