import Link from 'next/link';
import WorkSection from '~/app/WorkSection';
import BlogSection from '~/app/blog-section';
import Header from '~/components/header';
import Section from '~/components/section';

export default async function Home() {
	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<Header />
			<Section title='About' className='mt-16'>
				<p className='mb-8'>
					I&rsquo;m a Seattle-based software engineer with a penchant for React, TypeScript, and
					typo&shy;graphy, currently residing in the heart of Seattle.
					<br />
					<br />
					I&rsquo;m currently building insurance software at UnitedHealthcare. Before this, I worked
					at an Orlando-based IT firm for 7+ years, where{' '}
					<a href='https://read.cv/johneatmon/npsVXnwnPLc03Cfs6863'>
						I did everything from front-end web development to sales and marketing
					</a>
					.
					<br />
					<br />
					I grew up in Orlando, FL, where I graduated from the University of Central Florida with a
					BA in English. I dabbled with WordPress development and little Java programs when I was
					younger, but never took these skills further. That is, until the pandemic hit, when I
					decided get serious about coding. I&rsquo;ve been hooked ever since.
					<br />
					<br />
					When I&rsquo;m not tinkering with code, you can find me climbing mountains, reading, or
					perfecting my coffee brews.
				</p>
				<Link
					href='/'
					className='inline-block max-w-max rounded-md bg-accent px-3 py-1 text-sm leading-[2em] text-black transition hover:brightness-90'
				>
					Read my CV
				</Link>
				<Link
					href='/'
					className='inline-block max-w-max rounded-md px-3 py-1 text-sm leading-[2em] text-gray-950 shadow-border transition hover:shadow-border-hovered'
				>
					Read my CV
				</Link>
			</Section>
			<WorkSection />
			<BlogSection count={3} />
		</main>
	);
}
