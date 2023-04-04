/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/consistent-type-definitions */

// Modified, Astro-friendly version of shuding's react-wrap-balancer
// https://github.com/shuding/react-wrap-balancer

import React from "react"

const SYMBOL_KEY = "__wrap_b"
const SYMBOL_OBSERVER_KEY = "__wrap_o"
const IS_SERVER = typeof window === "undefined"
const useIsomorphicLayoutEffect = IS_SERVER ? React.useEffect : React.useLayoutEffect

interface WrapperElement extends HTMLElement {
	[SYMBOL_OBSERVER_KEY]?: ResizeObserver | undefined
}

type RelayoutFn = (id: string | number, ratio: number, wrapper?: WrapperElement) => void

declare global {
	interface Window {
		[SYMBOL_KEY]: RelayoutFn
	}
}

const relayout: RelayoutFn = (id, ratio, wrapper) => {
	wrapper = wrapper || document.querySelector<WrapperElement>(`[data-br="${id}"]`)
	const container = wrapper.parentElement

	const update = (width: number) => (wrapper.style.maxWidth = width + "px")

	// Reset wrapper width
	wrapper.style.maxWidth = ""

	// Get the initial container size
	const width = container.clientWidth
	const height = container.clientHeight

	// Synchronously do binary search and calculate the layout
	let lower: number = width / 2 - 0.25
	let upper: number = width + 0.5
	let middle: number

	if (width) {
		while (lower + 1 < upper) {
			middle = Math.round((lower + upper) / 2)
			update(middle)
			if (container.clientHeight === height) {
				upper = middle
			} else {
				lower = middle
			}
		}

		// Update the wrapper width
		update(upper * ratio + width * (1 - ratio))
	}

	// Create a new observer if we don't have one.
	// Note that we must inline the key here as we use `toString()` to serialize
	// the function.
	if (!wrapper["__wrap_o"]) {
		;(wrapper["__wrap_o"] = new ResizeObserver(() => {
			self.__wrap_b(0, +wrapper.dataset.brr, wrapper)
		})).observe(container)
	}
}

const RELAYOUT_STR = relayout.toString()

// const createScriptElement = (injected: boolean, suffix = "") => (
// 	<script
// 		suppressHydrationWarning
// 		dangerouslySetInnerHTML={{
// 			// Calculate the balance initially for SSR
// 			__html: (injected ? "" : `self.${SYMBOL_KEY}=${RELAYOUT_STR};`) + suffix,
// 		}}
// 	/>
// )

// new script tag where we insert our own unique ID
const createScriptElement = (uniqueId: string, injected: boolean, suffix = "") => {
	return (
		<script
			id={uniqueId}
			suppressHydrationWarning
			dangerouslySetInnerHTML={{
				// Calculate the balance initially for SSR
				__html: (injected ? "" : `self.${SYMBOL_KEY}=${RELAYOUT_STR};`) + suffix,
			}}
		/>
	)
}

interface BalancerProps extends React.HTMLAttributes<HTMLElement> {
	/**
	 * The HTML tag to use for the wrapper element.
	 * @default 'span'
	 */
	as?: React.ElementType
	/**
	 * The balance ratio of the wrapper width (0 <= ratio <= 1).
	 * 0 means the wrapper width is the same as the container width (no balance, browser default).
	 * 1 means the wrapper width is the minimum (full balance, most compact).
	 * @default 1
	 */
	ratio?: number
	children?: React.ReactNode
}

/**
 * An optional provider to inject the global relayout function, so all children
 * Balancer components can share it.
 */
const BalancerContext = React.createContext<boolean>(false)
const Provider: React.FC<{
	children?: React.ReactNode
}> = ({ children }) => {
	const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

	return (
		<BalancerContext.Provider value={true}>
			{createScriptElement(uniqueId, false)}
			{children}
		</BalancerContext.Provider>
	)
}

const Balancer: React.FC<BalancerProps> = ({
	as: Wrapper = "span",
	ratio = 1,
	children,
	...props
}) => {
	const wrapperRef = React.useRef<WrapperElement>()
	const hasProvider = React.useContext(BalancerContext)
	// const id = React.useId() <--- Astro no likey for some reason 😭
	const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5) // make a unique ID our own way!
	const id = uniqueId

	// Re-balance on content change and on mount/hydration.
	useIsomorphicLayoutEffect(() => {
		if (wrapperRef.current) {
			// Re-assign the function here as the component can be dynamically rendered, and script tag won't work in that case.
			;(self[SYMBOL_KEY] = relayout)(0, ratio, wrapperRef.current)
		}
	}, [children, ratio])

	// Remove the observer when unmounting.
	useIsomorphicLayoutEffect(() => {
		return () => {
			if (!wrapperRef.current) return

			const resizeObserver = wrapperRef.current[SYMBOL_OBSERVER_KEY]
			if (!resizeObserver) return

			resizeObserver.disconnect()
			delete wrapperRef.current[SYMBOL_OBSERVER_KEY]
		}
	}, [])

	if (process.env.NODE_ENV === "development") {
		// In development, we check `children`'s type to ensure we are not wrapping
		// elements like <p> or <h1> inside. Instead <Balancer> should directly
		// wrap text nodes.
		if (children && !Array.isArray(children) && typeof children === "object") {
			if ("type" in children && typeof children.type === "string" && children.type !== "span") {
				console.warn(
					`<Balancer> should not wrap <${children.type}> inside. Instead, it should directly wrap text or inline nodes.
					Try changing this:
					<Balancer><${children.type}>content</${children.type}></Balancer>
					To:
					<${children.type}><Balancer>content</Balancer></${children.type}>`,
				)
			}
		}
	}

	return (
		<>
			<Wrapper
				{...props}
				data-br={id}
				data-brr={ratio}
				ref={wrapperRef}
				style={{
					display: "inline-block",
					verticalAlign: "top",
					textDecoration: "inherit",
				}}
				suppressHydrationWarning
			>
				{children}
			</Wrapper>
			{/* {createScriptElement(hasProvider, `self.${SYMBOL_KEY}("${id}",${ratio})`)} */}
			{createScriptElement(uniqueId, hasProvider, `self.${SYMBOL_KEY}("${id}",${ratio})`)}
		</>
	)
}

// As Next.js adds `display: none` to `body` for development, we need to trigger
// a re-balance right after the style is removed, synchronously.
if (!IS_SERVER && process.env.NODE_ENV !== "production") {
	const next_dev_style = document.querySelector<HTMLElement>("[data-next-hide-fouc]")
	if (next_dev_style) {
		const callback: MutationCallback = (mutationList) => {
			for (const mutation of mutationList) {
				for (const node of Array.from(mutation.removedNodes)) {
					if (node !== next_dev_style) continue

					observer.disconnect()
					const elements = document.querySelectorAll<WrapperElement>("[data-br]")

					for (const element of Array.from(elements)) {
						self[SYMBOL_KEY](0, +element.dataset.brr, element)
					}
				}
			}
		}
		const observer = new MutationObserver(callback)
		observer.observe(document.head, { childList: true })
	}
}

export default Balancer
export { Provider }
