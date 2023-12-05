import { getMDXComponent } from 'next-contentlayer/hooks';
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

const img: FC<HTMLProps<HTMLImageElement>> = (props) => {
	if (typeof props.src !== 'string' || typeof props.alt !== 'string') {
		throw new Error('Image src and alt are required');
	}

	return (
		<BlurImage
			src={props.src}
			alt={props.alt}
			width={1240}
			height={698}
			unoptimized={props.src.startsWith('http')}
			className='overflow-hidden rounded'
		/>
	);
};

const dinkus: FC<HTMLProps<HTMLDivElement>> = (props) => (
	<div
		aria-hidden
		className='flex w-full items-center justify-center gap-x-6 font-serif text-gray-500 dark:text-gray-600'
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
	hr: dinkus,
};

export function Mdx({ code }: { code: string }) {
	const Component = getMDXComponent(code);

	return (
		<div className='prose prose-neutral max-w-2xl dark:prose-invert'>
			<Component components={components} />
		</div>
	);
}

export { components };
