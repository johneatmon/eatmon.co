import Link from 'next/link';
import { FC } from 'react';
import { ThemeToggleGroup } from '~/components/theme-toggle';
import GitHubIcon from '~/public/icons/github.svg';
import ReadCVIcon from '~/public/icons/readcv.svg';
import XIcon from '~/public/icons/x.svg';

export const socials = [
	{
		name: 'GitHub',
		url: '/github',
		icon: () => <GitHubIcon />,
	},
	{
		name: 'X',
		url: '/x',
		icon: () => <XIcon />,
	},
	{
		name: 'Read.CV',
		url: '/cv',
		icon: () => <ReadCVIcon />,
	},
];

const Footer: FC = () => (
	<footer className='border-t border-gray-300 dark:border-gray-800/80'>
		<div className='mx-auto flex max-w-2xl flex-col gap-y-4 px-4 pb-16 pt-10 font-sans '>
			<ThemeToggleGroup />
			<div className='flex flex-col gap-8'>
				<small>
					<span className='text-gray-600'>&copy; 2023 John Eatmon&ensp;&middot;&ensp;</span>
					<Link href='/colophon' className='text-gray-950 dark:text-gray-50'>
						Colophon
					</Link>
				</small>
				<ul role='list' className='flex items-center gap-x-2'>
					{socials.map(({ name, url, icon: Icon }, i) => (
						<li key={i}>
							<a
								title={name}
								href={url}
								className='grid aspect-square w-8 place-items-center text-gray-500 transition hover:text-gray-700 dark:hover:text-gray-200'
							>
								<Icon />
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	</footer>
);

export default Footer;
