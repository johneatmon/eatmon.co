import { FC } from 'react';
import { ThemeToggle } from '~/components/theme-toggle';

export const socials = [
	{
		name: 'GitHub',
		url: '#',
	},
	{
		name: 'X',
		url: '#',
	},
	{
		name: 'LinkedIn',
		url: '#',
	},
	{
		name: 'Read.CV',
		url: '#',
	},
];

const Footer: FC = () => (
	<footer className='mx-auto flex max-w-2xl flex-col gap-y-4 px-4 pb-6 pt-16 text-gray-500'>
		<ThemeToggle />
		<small className='flex items-center gap-x-4'>
			<span>&copy; 2023 John Eatmon</span>
			<ul role='list' className='flex items-center gap-x-2'>
				{socials.map(({ name, url }, i) => (
					<li key={i}>
						<a href={url}>{name}</a>
					</li>
				))}
			</ul>
		</small>
	</footer>
);

export default Footer;
