import React from "react"

// https://www.joshwcomeau.com/react/animated-sparkles-in-react/#just-the-beginning-8

const DEFAULT_COLOR = "#FFC700"

const usePrefersReducedMotion = () => {
	const QUERY = "(prefers-reduced-motion: no-preference)"
	const mediaQueryList = window.matchMedia(QUERY)
	const prefersReducedMotion = !mediaQueryList.matches

	return prefersReducedMotion
}

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const useRandomInterval = (callback, minDelay, maxDelay) => {
	const timeoutId = React.useRef(null)
	const savedCallback = React.useRef(callback)
	React.useEffect(() => {
		savedCallback.current = callback
	}, [callback])
	React.useEffect(() => {
		const isEnabled = typeof minDelay === "number" && typeof maxDelay === "number"
		if (isEnabled) {
			const handleTick = () => {
				const nextTickAt = random(minDelay, maxDelay)
				timeoutId.current = window.setTimeout(() => {
					savedCallback.current()
					handleTick()
				}, nextTickAt)
			}
			handleTick()
		}
		return () => window.clearTimeout(timeoutId.current)
	}, [minDelay, maxDelay])
	const cancel = React.useCallback(function () {
		window.clearTimeout(timeoutId.current)
	}, [])
	return cancel
}

const range = (start, end, step = 1) => {
	let output = []
	if (typeof end === "undefined") {
		end = start
		start = 0
	}
	for (let i = start; i < end; i += step) {
		output.push(i)
	}
	return output
}

const generateSparkle = (color) => {
	const sparkle = {
		id: String(random(10000, 99999)),
		createdAt: Date.now(),
		color,
		size: random(10, 20),
		style: {
			top: random(0, 80) + "%",
			left: random(0, 100) + "%",
		},
	}
	return sparkle
}

const Sparkles = ({ color = DEFAULT_COLOR, children, ...delegated }) => {
	const [sparkles, setSparkles] = React.useState(() => {
		return range(3).map(() => generateSparkle(color))
	})
	const prefersReducedMotion = usePrefersReducedMotion()
	useRandomInterval(
		() => {
			const sparkle = generateSparkle(color)
			const now = Date.now()
			const nextSparkles = sparkles.filter((sp) => {
				const delta = now - sp.createdAt
				return delta < 750
			})
			nextSparkles.push(sparkle)
			setSparkles(nextSparkles)
		},
		prefersReducedMotion ? null : 50,
		prefersReducedMotion ? null : 450,
	)
	return (
		<span {...delegated} className="inline-block relative">
			{sparkles.map((sparkle) => (
				<Sparkle key={sparkle.id} color={sparkle.color} size={sparkle.size} style={sparkle.style} />
			))}
			<span className="relative z-[1]">{children}</span>
		</span>
	)
}

const Sparkle = ({ size, color, style }) => {
	const path =
		"M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z"
	return (
		<span style={style} className="absolute block animate-comeInOut">
			<svg
				width={size}
				height={size}
				viewBox="0 0 68 68"
				fill="none"
				className="block animate-spinSparkles"
			>
				<path d={path} fill={color} />
			</svg>
		</span>
	)
}

export default Sparkles
