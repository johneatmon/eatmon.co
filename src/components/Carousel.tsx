import "blaze-slider/dist/blaze.css"
import type { ReactNode } from "react"
import { useBlazeSlider } from "react-blaze-slider"

const Carousel = ({ children }: { children: ReactNode }) => {
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

	return (
		<div className="blaze-slider | not-prose -mx-2 md:-mx-8" ref={ref}>
			<div className="blaze-container">
				<div className="mb-4 flex justify-end gap-x-3">
					<button
						className="blaze-prev | grid aspect-square h-11 place-items-center rounded-full border border-gray-300 bg-white transition hover:bg-gray-300/70 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900"
						aria-label="Go to previous slide"
					>
						&larr;
					</button>
					<button
						className="blaze-next | grid aspect-square h-11 place-items-center rounded-full border border-gray-300 bg-white transition hover:bg-gray-300/70 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900"
						aria-label="Go to next slide"
					>
						&rarr;
					</button>
				</div>
				<div className="blaze-track-container">{children}</div>
			</div>
		</div>
	)
}

export default Carousel
