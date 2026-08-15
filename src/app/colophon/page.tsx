import type { Metadata } from 'next';
import { Mdx } from '~/components/mdx';
import { ReturnLink } from '~/components/return-link';
import colophon from '../../../COLOPHON.md';

export const metadata: Metadata = {
  title: 'Colophon',
  description: 'How this site is built.',
};

export default function ColophonPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <ReturnLink href="/">Index</ReturnLink>
      <div className="reveal mt-12">
        <Mdx source={colophon} />
      </div>
    </main>
  );
}
