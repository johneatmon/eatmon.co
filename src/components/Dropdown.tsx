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
			className="w-3 h-3 transition ui-open:rotate-180"
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
				<Menu.Button className="group inline-flex items-center justify-center gap-x-1 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
					{props.children}
					<ChevronDown />
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
					<Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="p-1">
							{links.map((link, i) => (
								<Menu.Item
									key={i}
									as="a"
									href={link.href.toString()}
									className="ui-active:bg-gradient-to-r ui-active:from-purple-700 ui-active:to-indigo-500 group flex w-full items-center rounded-md px-2 py-2 text-sm"
								>
									{link.label}
								</Menu.Item>
							))}
							<Menu.Item
								as="button"
								className="ui-active:bg-gradient-to-r ui-active:from-purple-700 ui-active:to-indigo-500 group flex w-full items-center rounded-md px-2 py-2 text-sm"
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
				isSuccess={true}
				showToast={showToast}
				setShowToast={setShowToast}
			/>
		</>
	)
}

export default Dropdown
