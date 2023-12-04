import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

const ReturnLink: FC<{ children: ReactNode; href: string }> = ({ children, href }) => {
	return (
		<Link
			href={href}
			className='group inline-flex items-center gap-1 font-sans text-sm text-gray-500 no-underline transition-colors hover:text-gray-600 focus:text-gray-600 focus:outline-none'
		>
			<ArrowLeftIcon className='inline-block h-4 w-4 transition group-hover:-translate-x-0.5 group-hover:text-gray-600' />
			{children}
		</Link>
	);
};
export default ReturnLink;
