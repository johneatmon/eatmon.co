import { motion } from "framer-motion"
import type { HTMLAttributes, ReactNode } from "react"
import { useRef, useState } from "react"

function getRelativeCoordinates(event, referenceElement) {
	const position = {
		x: event.pageX,
		y: event.pageY,
	}

	const offset = {
		left: referenceElement.offsetLeft,
		top: referenceElement.offsetTop,
	}

	let reference = referenceElement.offsetParent

	while (reference) {
		offset.left += reference.offsetLeft
		offset.top += reference.offsetTop
		reference = reference.offsetParent
	}

	return {
		x: position.x - offset.left,
		y: position.y - offset.top,
	}
}

type Props = {
	children?: ReactNode
} & HTMLAttributes<"a">

const SpotlightButton = (props: Props) => {
	const style = {
		position: "absolute",
		inset: 0,
		width: "100%",
		height: "100%",
		// zIndex: 0,
		boxSizing: "border-box",
		borderRadius: "inherit",
		WebkitMaskImage: `radial-gradient(circle at center, rgb(255, 255, 255) 0%, rgba(0, 0, 0, 0) 100%)`,
		opacity: 0,
		// Change this gradient
		backgroundImage: `linear-gradient(to right, rgba(181, 97, 255, 0.2), rgba(134, 104, 255, 0.2))`,
		// Optional border style
		border: "1px solid rgba(181, 97, 255, 0.6)",
	}

	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const boxRef = useRef()
	const handleMouseMove = (e) => {
		setMousePosition(getRelativeCoordinates(e, boxRef.current))
	}
	return (
		<a
			{...props}
			ref={boxRef}
			onMouseMove={(e) => handleMouseMove(e)}
			className="inline-block relative border border-gray-8 dark:border-gray-6 hover:border-transparent rounded-md px-4 py-2 text-sm font-medium"
		>
			<motion.div
				className="mix-blend-darken dark:mix-blend-lighten"
				style={{
					...style,
				}}
				whileHover={{
					opacity: 1,
					cursor: "pointer",
				}}
				animate={{
					WebkitMaskImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgb(255, 255, 255) 0%, rgba(0, 0, 0, 0) 100%)`,
				}}
				// optional delay
				transition={{
					property: "opacity",
					duration: 0.3,
					ease: [0.17, 0.67, 0.83, 0.67],
				}}
			/>
			{props.children}
		</a>
	)
}

export default SpotlightButton
