import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ComponentProps } from 'react';
import remarkGfm from 'remark-gfm';
import { highlight } from 'sugar-high';
import { BlurImage } from '~/components/image';
import { remarkSmartypants } from '~/lib/remark-smartypants';
import { cn } from '~/lib/utils';

const linkClassName =
  'underline text-(--foreground) transition-opacity duration-200 hover:opacity-70';

function Anchor({ href = '', className, children, ...props }: ComponentProps<'a'>) {
  const external = href.startsWith('http');

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkClassName, className)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(linkClassName, className)} {...props}>
      {children}
    </Link>
  );
}

function Code({ children, className, ...props }: ComponentProps<'code'>) {
  const code = String(children);

  if (className?.includes('language-')) {
    return (
      <code
        className={className}
        dangerouslySetInnerHTML={{ __html: highlight(code) }}
        {...props}
      />
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

function Pre({ children, ...props }: ComponentProps<'pre'>) {
  return <pre {...props}>{children}</pre>;
}

function Img(props: ComponentProps<'img'>) {
  const { src, alt = '', width = 1200, height = 675, className } = props;

  if (typeof src !== 'string') return null;

  return (
    <BlurImage
      src={src}
      alt={alt}
      width={Number(width)}
      height={Number(height)}
      className={className}
    />
  );
}

const components = {
  a: Anchor,
  code: Code,
  pre: Pre,
  img: Img,
  Image: BlurImage,
};

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral prose-site dark:prose-invert">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkSmartypants],
          },
        }}
      />
    </div>
  );
}
