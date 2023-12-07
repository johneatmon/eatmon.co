import AboutSection from '~/app/(home)/about-section';
import BlogSection from '~/app/(home)/blog-section';
import WorkSection from '~/app/(home)/work-section';
import Header from '~/components/header';

export default async function Home() {
	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<Header />
			<AboutSection className='mt-16' />
			<WorkSection />
			<BlogSection count={3} />
		</main>
	);
}
