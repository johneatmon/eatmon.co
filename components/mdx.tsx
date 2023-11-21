import { getMDXComponent } from 'next-contentlayer/hooks';
import Image from 'next/image';
import type { FC, HTMLProps } from 'react';

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
		<Image
			src={props.src}
			alt={props.alt}
			width={1240}
			height={698}
			unoptimized={props.src.startsWith('http')}
			className='overflow-hidden rounded'
		/>
	);
};

const components = {
	a,
	img,
};

export function Mdx({ code }: { code: string }) {
	const Component = getMDXComponent(code);

	return (
		<div className='prose prose-zinc max-w-2xl dark:prose-invert'>
			<Component components={components} />
		</div>
	);
}
