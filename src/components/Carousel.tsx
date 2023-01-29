import "blaze-slider/dist/blaze.css"
import type { FC, ReactNode } from "react"
import { useBlazeSlider } from "react-blaze-slider"

// const ACCESS_TOKEN = import.meta.env.DRIBBBLE_ACCESS_TOKEN

// const res = async () => {
// 	const res = await fetch("https://api.dribbble.com/v2/user/shots", {
// 		method: "GET",
// 		headers: {
// 			Authorization: `Bearer ${ACCESS_TOKEN}`,
// 			"Content-Type": "application/json",
// 		},
// 	})

// 	return await res.json()
// }

// const shots = await res

type Props = {
	children?: ReactNode
}

const Carousel: FC = (props: Props) => {
	const ref = useBlazeSlider({
		all: {
			slidesToShow: 2,
			transitionDuration: 800,
		},
		"(min-width: 768px)": {
			slidesToShow: 1.75,
		},
		"(min-width: 600px)": {
			slidesToShow: 1.5,
		},
		"(max-width: 600px)": {
			slidesToShow: 1,
		},
	})

	// if (!shots) {
	// 	return null
	// }

	return (
		<div className="blaze-slider | not-prose -mx-2 md:-mx-8" ref={ref}>
			<div className="blaze-container">
				<div className="flex justify-end gap-x-3 mb-4">
					<button
						className="blaze-prev | h-11 aspect-square grid place-items-center rounded-full border border-gray-300 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-300/70 dark:hover:bg-gray-900 transition"
						aria-label="Go to previous slide"
					>
						&larr;
					</button>
					<button
						className="blaze-next | h-11 aspect-square grid place-items-center rounded-full border border-gray-300 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-300/70 dark:hover:bg-gray-900 transition"
						aria-label="Go to next slide"
					>
						&rarr;
					</button>
				</div>
				<div className="blaze-track-container">
					{props.children}
					{/* <div className="blaze-track"> */}
					{/* {shots.map(({ html_url, images, height, width, title, published_at }, i) => (
							<a
								key={i}
								href={html_url}
								className="bg-white dark:bg-black rounded-lg border border-gray-300 dark:border-gray-800 block group"
							>
								<img
									src={images.hidpi}
									alt=""
									className="rounded-t-lg aspect-[4/3]"
									height={height}
									width={width}
								/>
								<div className="p-4 flex flex-col group-hover:bg-gray-300/70 dark:group-hover:bg-gray-900 transition">
									<h3 className="font-medium">{title}</h3>
									<p className="text-sm text-gray-400">
										Posted&nbsp;
										<time dateTime={new Date(published_at).toISOString()}>
											{new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
												new Date(published_at),
											)}
										</time>
									</p>
								</div>
							</a>
						))} */}
					{/* </div> */}
				</div>
			</div>
		</div>
	)
}

export default Carousel
