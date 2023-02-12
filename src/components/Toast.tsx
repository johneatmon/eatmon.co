import * as ToastPrimitive from "@radix-ui/react-toast"
import { clsx } from "clsx"

import type { ReactNode } from "react"
import { useMediaQuery } from "../lib/use-media-query"

const XMark = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className="aspect-square w-5"
		>
			<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
		</svg>
	)
}

type ToastProps = {
	title: string
	description?: string
	showToast: boolean
	setShowToast: any
	children?: ReactNode
}

const Toast = (props: ToastProps) => {
	const isMd = useMediaQuery("(min-width: 768px)")

	return (
		<ToastPrimitive.Provider swipeDirection={isMd ? "right" : "down"}>
			<ToastPrimitive.Root
				open={props.showToast}
				onOpenChange={props.setShowToast}
				className={clsx(
					"fixed inset-x-4 top-14 right-4 left-auto bottom-auto z-50 w-auto rounded-lg shadow-lg md:w-full md:max-w-sm",
					"border border-gray-200 bg-white dark:border-gray-800 dark:bg-black",
					"radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
					"radix-state-closed:animate-toast-hide",
					"radix-swipe-direction-right:radix-swipe-end:animate-toast-swipe-out-x",
					"radix-swipe-direction-right:translate-x-radix-toast-swipe-move-x",
					"radix-swipe-direction-down:radix-swipe-end:animate-toast-swipe-out-y",
					"radix-swipe-direction-down:translate-y-radix-toast-swipe-move-y",
					"radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
					"focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
				)}
			>
				<div className="flex items-center gap-x-2 px-5 py-4">
					<div className="radix flex-grow">
						<ToastPrimitive.Title className="text-sm font-semibold">
							{props.title}
						</ToastPrimitive.Title>
						{props.description && (
							<ToastPrimitive.Description className="text-gray-11 mt-1 text-sm">
								{props.description}
							</ToastPrimitive.Description>
						)}
					</div>

					<ToastPrimitive.Close className="rounded-full border border-transparent bg-white p-3 text-sm font-medium hover:bg-gray-300 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-700 focus-visible:ring-opacity-75 dark:bg-black dark:hover:bg-gray-900">
						<XMark />
					</ToastPrimitive.Close>
				</div>
			</ToastPrimitive.Root>
			<ToastPrimitive.Viewport />
		</ToastPrimitive.Provider>
	)
}

export default Toast
