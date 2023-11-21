import Image, { ImageProps } from 'next/image';
import fs from 'node:fs/promises';
import { getPlaiceholder } from 'plaiceholder';
import { FC } from 'react';
import { cn, parseError } from '~/lib/utils';

const remoteBlurHash = async (src: string) => {
	try {
		const buffer = await fetch(src).then(async (res) => Buffer.from(await res.arrayBuffer()));
		const { base64 } = await getPlaiceholder(buffer);

		return base64;
	} catch (error: unknown) {
		const message = parseError(error);
		throw new Error(message);
	}
};

const localBlurHash = async (src: string) => {
	try {
		const file = await fs.readFile(src);
		const { base64 } = await getPlaiceholder(file);

		return base64;
	} catch (error: unknown) {
		const message = parseError(error);
		throw new Error(message);
	}
};

const BlurImage: FC<ImageProps> = async ({ src, alt, className = '', ...props }: ImageProps) => {
	if (typeof src !== 'string' || typeof alt !== 'string') {
		throw new Error('Image src and alt are required');
	}

	let blurHash;
	if (src.startsWith('https')) {
		blurHash = await remoteBlurHash(src);
	} else {
		blurHash = await localBlurHash(src);
	}

	return (
		<Image
			src={src}
			alt={alt ?? ''}
			width={1240}
			height={698}
			unoptimized={src.startsWith('http')}
			draggable={false}
			className={cn('overflow-hidden rounded italic', className)}
			blurDataURL={blurHash}
			loading='lazy'
			{...props}
		/>
	);
};
export default BlurImage;
