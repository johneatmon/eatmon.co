import type { FC } from "react"
import { useEffect, useState } from "react"

const ThemeToggle: FC = () => {
	const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "dark")

	const handleClick = () => {
		setTheme(theme === "light" ? "dark" : "light")
	}

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.setAttribute("data-mode", "dark")
		} else {
			document.documentElement.removeAttribute("data-mode")
		}
		localStorage.setItem("theme", theme)
	}, [theme])

	return (
		<button
			type="button"
			aria-label="Toggle dark mode"
			onClick={handleClick}
			className="group relative grid place-items-center py-3 px-2 -mr-2 sm:px-[18px] sm:-mr-[18px] rounded-full"
		>
			{theme === "light" ? "🌙" : "🌞"}
		</button>
	)
}

export default ThemeToggle
