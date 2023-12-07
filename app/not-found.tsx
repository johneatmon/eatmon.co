import type { Metadata } from 'next';
import ReturnLink from '~/components/return-link';
import Section from '~/components/section';
import { Shine } from '~/components/shine';

export const metadata: Metadata = {
	title: 'Not Found',
	description: "Something's missing...",
};

export default function NotFoundPage() {
	return (
		<main className='mx-auto flex max-w-2xl flex-col gap-16 px-4 pb-24 pt-[128px]'>
			<ReturnLink href='/'>Index</ReturnLink>
			<Section>
				<div>
					<Shine
						className='font-serif text-8xl font-bold tracking-tight text-[#0F0F0F]'
						lightColor='#f7f7f7'
					>
						404
					</Shine>
				</div>
				<p className='mt-8'>Looks like you&rsquo;re lost, kiddo.</p>
			</Section>
		</main>
	);
}
