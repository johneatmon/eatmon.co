import Link from 'next/link';
import { FC } from 'react';
import { ThemeToggleGroup } from '~/components/theme-toggle';

export const socials = [
	{
		name: 'GitHub',
		url: 'https://github.com/johneatmon',
		icon: '/icons/github.svg',
	},
	{
		name: 'X',
		url: 'https://twitter.com/johneatmon_',
		icon: '/icons/x.svg',
	},
	{
		name: 'Read.CV',
		url: 'https://read.cv/johneatmon',
		icon: '/icons/readcv.svg',
	},
];

const Footer: FC = () => (
	<footer className='border-t border-gray-300 dark:border-gray-800/80'>
		<div className='mx-auto flex max-w-2xl flex-col gap-y-4 px-4 pb-16 pt-10 font-sans text-gray-600'>
			<ThemeToggleGroup />
			<div className='flex flex-col gap-8'>
				<small>
					&copy; 2023 John Eatmon &middot;{' '}
					<Link href='/colophon' className='hover:text-gray-950 dark:hover:text-gray-50'>
						Colophon
					</Link>
				</small>
				<ul role='list' className='flex items-center gap-x-2'>
					{socials.map(({ name, url, icon }, i) => (
						<li key={i}>
							<a
								title={name}
								href={url}
								className='grid aspect-square w-8 place-items-center text-gray-400 transition hover:text-gray-950 dark:text-gray-700 dark:hover:text-gray-50'
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={icon}
									alt={`${name} icon`}
									className='m-0 aspect-square w-5 transition-all dark:invert'
									width={20}
									height={20}
								/>
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	</footer>
);

export default Footer;
