import Image, { type ImageProps } from 'next/image';
import { getBlurDataURL } from '~/lib/blur';
import { cn } from '~/lib/utils';

type BlurImageProps = ImageProps & {
  src: string;
  alt: string;
};

export async function BlurImage({ src, alt, className, ...props }: BlurImageProps) {
  const blurDataURL = await getBlurDataURL(src);

  return (
    <Image
      src={src}
      alt={alt}
      width={props.width ?? 600}
      height={props.height ?? 400}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      draggable={false}
      className={cn('overflow-hidden', className)}
      {...props}
    />
  );
}
