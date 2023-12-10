import Link from 'next/link';
import { socials } from '~/components/footer';
import Section from '~/components/section';

const work = [
	{
		position: 'Software Engineer',
		company: 'UnitedHealthcare',
		href: 'https://www.uhc.com/',
		startDate: '2023',
		endDate: null,
	},
	{
		position: 'Creative Developer',
		company: 'ProSource',
		href: 'https://www.getprosource.com/',
		startDate: '2020',
		endDate: '2023',
	},
	{
		position: 'IT Coordinator',
		company: 'ProSource',
		href: 'https://www.getprosource.com/',
		startDate: '2016',
		endDate: '2020',
	},
	{
		position: 'Intern',
		company: 'ProSource',
		href: 'https://www.getprosource.com/',
		startDate: '2014',
		endDate: '2016',
	},
];

const WorkSection = () => {
	const cvLink = socials.find(({ name }) => name === 'Read.CV')?.url ?? '#';

	return (
		<Section title='Work'>
			<ul role='list' className='flex flex-col gap-y-4'>
				{work.map(({ company, endDate, startDate, position, href }, index) => (
					<li
						key={index}
						className='flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-2'
					>
						<p className='font-sans'>
							<a
								href={href}
								target='_blank'
								rel='noopener noreferrer'
								className='text-gray-950 dark:text-gray-50'
							>
								{position}
							</a>
							, <span className='text-gray-700 dark:text-gray-500'>{company}</span>
						</p>
						<div className='hidden h-px grow bg-gray-300 dark:bg-gray-800/80 sm:flex' />
						<p className='text-sm tabular-nums text-gray-700 dark:text-gray-500'>
							{startDate}&ndash;{endDate ?? 'Now'}
						</p>
					</li>
				))}
			</ul>
			<Link
				href={cvLink}
				className='mt-8 inline-block max-w-max rounded-md px-3 py-1 font-sans text-sm leading-[2em] text-black no-underline shadow-border transition hover:shadow-border-hovered dark:bg-accent dark:shadow-none dark:hover:brightness-90'
			>
				Read my CV
			</Link>
		</Section>
	);
};
export default WorkSection;
