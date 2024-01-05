import { getMDXComponent } from 'next-contentlayer/hooks';
import Image from 'next/image';
import type { FC, HTMLProps } from 'react';
import BlurImage from '~/components/image';

const a: FC<HTMLProps<HTMLAnchorElement>> = ({ href, ...props }) => {
	if (typeof href !== 'string') {
		throw new Error('href is required');
	}

	return (
		<a
			{...props}
			href={href}
			target={href.startsWith('http') ? '_blank' : undefined}
			rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
		/>
	);
};

const img: FC<HTMLProps<HTMLImageElement>> = ({ src, alt, width = 1240, height = 698 }) => {
	if (typeof src !== 'string' || typeof alt !== 'string') {
		throw new Error('Image src and alt are required');
	}

	return (
		<Image
			src={src}
			alt={alt}
			unoptimized={src.startsWith('http')}
			width={Number(width)}
			height={Number(height)}
			draggable={false}
			loading='lazy'
			className='overflow-hidden rounded-lg'
		/>
	);
};

const dinkus: FC<HTMLProps<HTMLDivElement>> = (props) => (
	<div
		aria-hidden
		className='my-[1.5em] flex w-full items-center justify-center gap-x-6 text-gray-500 dark:text-gray-600'
		{...props}
	>
		{Array.from({ length: 3 }).map((_, index) => (
			<span key={index}>*</span>
		))}
	</div>
);

const components = {
	a,
	img,
	Image: BlurImage,
	hr: dinkus,
};

export function Mdx({ code }: { code: string }) {
	const Component = getMDXComponent(code);

	return (
		<div className='prose prose-neutral max-w-prose dark:prose-invert'>
			<Component components={components} />
		</div>
	);
}

export { components };
