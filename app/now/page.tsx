import { Eye } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { ReactNode, Suspense } from 'react';
import Slider from '~/app/now/horizontal-scroll';
import Header from '~/components/header';
import Section from '~/components/section';
import fetchMovies from '~/lib/letterboxd';
import { fetchBooks } from '~/lib/literal';
import { getYNABDebt } from '~/lib/metrics';
import { cn } from '~/lib/utils';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

const Card = ({
	title,
	link,
	subtitle,
	image,
	index,
}: {
	title: string;
	link: string;
	subtitle: ReactNode;
	image: string;
	index?: number;
}) => {
	return (
		<>
			<Image
				className='mb-2 aspect-[6/9] h-auto w-full border border-gray-900'
				src={image}
				alt={`Movie poster for the film: ${title}`}
				loading={index && index > 3 ? 'lazy' : undefined}
				width='167'
				height='250'
				draggable={false}
			/>
			<h3 className='line-clamp-1 text-sm font-medium text-gray-50'>
				<a
					href={new URL(link).href}
					className='underline decoration-gray-500 decoration-[0.075em] underline-offset-1 transition hover:decoration-gray-50'
				>
					{title}
				</a>
			</h3>
			<small className='flex items-center gap-x-1 text-gray-400'>{subtitle}</small>
		</>
	);
};

export default async function NowPage() {
	const movies = await fetchMovies(6);
	const books = await fetchBooks(6);

	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<Header />
			<Section title='Current debt'>
				Total debt:{' '}
				<Suspense fallback={<span>Loading balance...</span>}>
					<DebtBalance />
				</Suspense>
			</Section>
			<Section title="Movies I've watched recently">
				<div className='relative z-0'>
					<div className='pointer-events-none absolute inset-0 z-20 h-full w-full bg-gradient-to-r from-transparent from-[69%] to-black' />
					<Slider>
						{movies.map((movie, index) => (
							<div key={index}>
								<Card
									{...movie}
									index={index}
									subtitle={
										<>
											<Eye size={14} className='text-gray-700' />
											<time dateTime={new Date(movie.date).toISOString()}>
												{new Date(movie.date).toLocaleDateString('en-US', {
													month: 'long',
													day: 'numeric',
													year: 'numeric',
												})}
											</time>
										</>
									}
								/>
							</div>
						))}
					</Slider>
				</div>
			</Section>
			<Section title="Books I've read recently">
				<div className='relative z-0'>
					<div className='pointer-events-none absolute inset-0 z-20 h-full w-full bg-gradient-to-r from-transparent from-[69%] to-black' />
					<Slider>
						{books.map(({ title, cover, slug, authors }, index) => (
							<div key={index}>
								<Card
									title={title}
									link={`https://literal.club/johneatmon/book/${slug}`}
									image={cover}
									index={index}
									subtitle={
										<>
											{authors && (
												<span>
													{authors
														.map(({ name }) => name)
														.filter(Boolean)
														.join(', ')}
												</span>
											)}
										</>
									}
								/>
							</div>
						))}
					</Slider>
				</div>
			</Section>
		</main>
	);
}

async function DebtBalance() {
	const balance = await getYNABDebt();

	return (
		<span className={cn(balance < 0 && 'text-red-500')}>
			{Number(balance).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
		</span>
	);
}