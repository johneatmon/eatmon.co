import Balancer from "@lib/react-wrap-balancer"
import type { ElementType, ReactNode } from "react"

const CustomBalancer = ({
	children,
	ratio,
	as,
}: {
	children?: ReactNode
	ratio?: number
	as?: ElementType
}) => {
	return (
		<Balancer ratio={ratio} as={as}>
			{children}
		</Balancer>
	)
}

export { CustomBalancer }
