import { Glimpse, useGlimpse } from "@beskar-labs/glimpse/client"
import type { FC } from "react"

const ArrowUpRight = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="text-current"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
			/>
		</svg>
	)
}

const fetcher = async (url: string) => {
	const response = await fetch("/api/glimpse", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			url,
		}),
	})

	return response.json()
}

const LinkPreview: FC = () => {
	const data = useGlimpse(fetcher)

	if (!data?.image) {
		return null
	}

	return (
		<Glimpse className="pointer-events-none fixed z-20 flex w-[316px] translate-x-2 translate-y-2 flex-col rounded-lg bg-zinc-900/90 p-3 shadow-lg backdrop-blur-md transition-opacity group-hover:-translate-y-2 dark:bg-zinc-800 print:hidden">
			<img
				className="m-0 h-[174px] w-full rounded-sm object-cover"
				src={data.image}
				width={316}
				height={174}
				alt=""
				loading="eager"
			/>
			<p
				className={`text-md mt-2 block font-medium leading-normal ${
					data.description ? "line-clamp-1" : "line-clamp-3"
				}`}
			>
				{data.title}
			</p>
			<p className="line-clamp-2 block text-sm leading-normal text-zinc-300">{data.description}</p>
			<span className="flex flex-wrap items-center gap-1 text-gray-11">
				<p className="line-clamp-1 block text-sm leading-normal">{data.url}</p>
				<ArrowUpRight />
			</span>
		</Glimpse>
	)
}

export default LinkPreview