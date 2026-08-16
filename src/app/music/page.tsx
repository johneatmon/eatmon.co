import type { Metadata } from 'next';
import { MusicLibrary } from '~/components/music-players';
import { ReturnLink } from '~/components/return-link';
import { getPublishedTracks, partitionTracks } from '~/lib/music';

export const metadata: Metadata = {
  title: 'Music',
  description: 'Finished and unfinished tracks by AYURA.',
  openGraph: {
    title: 'Music — AYURA',
    description: 'Finished and unfinished tracks by AYURA.',
    images: [{ url: '/og?title=Music', width: 1200, height: 630 }],
  },
};

export default async function MusicPage() {
  const tracks = await getPublishedTracks();
  const { finished, unfinished } = partitionTracks(tracks);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 pt-16 pb-24 sm:px-8 sm:pt-24">
      <ReturnLink href="/">Index</ReturnLink>

      <div className="reveal reveal-delay-1 mt-16">
        {tracks.length === 0 ? (
          <p className="border-t border-(--border) py-10 text-(--muted)">
            Upload an MP3 with{' '}
            <code className="font-mono text-[0.9em] text-(--foreground)">pnpm music:upload</code> to
            populate this page.
          </p>
        ) : (
          <MusicLibrary finished={finished} unfinished={unfinished} />
        )}
      </div>
    </main>
  );
}
