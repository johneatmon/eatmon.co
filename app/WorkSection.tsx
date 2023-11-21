import ProSourceIcon from '~/components/icons/prosource';
import UHCIcon from '~/components/icons/unitedhealthcare';
import Section from '~/components/section';

const work = [
	{
		position: 'Software Engineer',
		company: 'UnitedHealthcare',
		href: 'https://www.uhc.com/',
		icon: () => <UHCIcon width={36} height={36} />,
		startDate: '2023',
		endDate: null,
	},
	{
		position: 'Creative Developer',
		company: 'ProSource',
		href: 'https://read.cv/johneatmon/npsVXnwnPLc03Cfs6863',
		icon: () => <ProSourceIcon width={36} height={36} />,
		startDate: '2020',
		endDate: '2023',
	},
	{
		position: 'IT Coordinator',
		company: 'ProSource',
		href: 'https://read.cv/johneatmon/npsVXnwnPLc03Cfs6863',
		icon: () => <ProSourceIcon width={36} height={36} />,
		startDate: '2016',
		endDate: '2020',
	},
];

const WorkSection = () => {
	return (
		<Section title='Work'>
			<ul role='list' className='flex flex-col gap-y-4'>
				{work.map(({ company, endDate, startDate, position, icon: Icon, href }, index) => (
					<li key={index} className='flex items-center justify-between gap-2'>
						<div className='flex items-center gap-x-4'>
							<div className='overflow-clip rounded-md'>
								<Icon />
							</div>
							<p className='flex flex-col'>
								<a
									href={href}
									className='text-sm font-medium text-gray-100 underline decoration-gray-700 underline-offset-1'
									target='_blank'
									rel='noopener noreferrer'
								>
									{position}
								</a>
								<small className='text-gray-400'>{company}</small>
							</p>
						</div>
						<div className='h-px grow bg-gray-800' />
						<small className='tabular-nums text-gray-400'>
							{startDate}&ndash;{endDate ?? 'Present'}
						</small>
					</li>
				))}
			</ul>
		</Section>
	);
};
export default WorkSection;
