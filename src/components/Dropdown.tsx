import { Menu, Transition } from "@headlessui/react"
import type { ReactNode } from "react"
import { Fragment, useState } from "react"
import { EMAIL, SOCIALS } from "../data/config"
import Toast from "./Toast"

const email = SOCIALS.filter((x) => x.label === "Email").map(({ href }) => href)
const linkedin = SOCIALS.filter((x) => x.label === "LinkedIn").map(({ href }) => href)
const cv = SOCIALS.filter((x) => x.label === "ReadCV").map(({ href }) => href)

const ChevronDown = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="text-gray-12 ml-1 inline h-3 w-3 transition ui-open:rotate-180"
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
		</svg>
	)
}

const links = [
	{ href: email, label: "Email me" },
	{ href: linkedin, label: "LinkedIn" },
	{ href: cv, label: "Résumé" },
]

type Props = {
	children: ReactNode
}

const Dropdown = (props: Props) => {
	const [showToast, setShowToast] = useState(false)

	async function copyEmail() {
		const clipboard = await navigator.clipboard
		await clipboard.writeText(EMAIL).then(() => {
			setShowToast(true)
		})
	}

	return (
		<>
			<Menu as="div" className="relative inline-block">
				<Menu.Button className="group relative inline-block py-4 px-3">
					<span className="text-gray-500 transition group-hover:text-gray-900 ui-open:text-gray-900 dark:text-gray-400 dark:group-hover:text-white dark:ui-open:text-white">
						{props.children}
					</span>
					<ChevronDown />
					<span className="absolute inset-x-1 -bottom-px h-px ui-open:bg-gradient-purple dark:ui-open:bg-gradient-purple-dark"></span>
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-black/20 bg-white shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none dark:bg-black dark:ring-black">
						<div className="p-1">
							{links.map((link, i) => (
								<Menu.Item
									key={i}
									as="a"
									href={link.href.toString()}
									className="group flex w-full items-center rounded-md px-2 py-2 text-sm transition hover:text-white ui-active:bg-gradient-to-r ui-active:from-purple-700 ui-active:to-indigo-500 dark:hover:text-black dark:ui-active:from-purple-400 dark:ui-active:to-indigo-400"
								>
									{link.label}
								</Menu.Item>
							))}
							<Menu.Item
								as="button"
								className="group flex w-full items-center rounded-md px-2 py-2 text-sm transition hover:text-white ui-active:bg-gradient-to-r ui-active:from-purple-700 ui-active:to-indigo-500 dark:hover:text-black dark:ui-active:from-purple-400 dark:ui-active:to-indigo-400"
								onClick={copyEmail}
							>
								Copy my email address
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>

			<Toast
				title="Email address copied"
				description="Can't wait to hear from you!"
				showToast={showToast}
				setShowToast={setShowToast}
			/>
		</>
	)
}

export default Dropdown
