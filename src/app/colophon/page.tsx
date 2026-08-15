import type { Metadata } from 'next';
import { Mdx } from '~/components/mdx';
import { ReturnLink } from '~/components/return-link';
import colophon from '~/content/colophon.md';

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'The technologies, services, and inspiration behind this site.',
};

export default function ColophonPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <ReturnLink href="/">Index</ReturnLink>
      <article className="reveal mt-12">
        <header className="mb-12 max-w-2xl">
          <h1 className="text-4xl leading-[1.08] tracking-[-0.045em] text-balance sm:text-5xl">
            {metadata.title as string}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[color-mix(in_oklab,var(--foreground)_72%,transparent)]">
            {metadata.description}
          </p>
        </header>
        <Mdx source={colophon} />
      </article>
    </main>
  );
}
