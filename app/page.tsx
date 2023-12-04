import AboutSection from '~/app/about-section';
import BlogSection from '~/app/blog-section';
import WorkSection from '~/app/work-section';
import Header from '~/components/header';

export default async function Home() {
	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<Header />
			{/* <div>
				<Shine
					className='font-serif text-5xl font-bold tracking-tight text-[#0F0F0F]'
					lightColor='#f7f7f7'
				>
					John Eatmon
				</Shine>
			</div> */}
			<AboutSection className='mt-16' />
			<WorkSection />
			<BlogSection count={3} />
		</main>
	);
}
