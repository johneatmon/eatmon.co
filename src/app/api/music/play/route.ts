import { NextResponse } from 'next/server';
import { getPublishedTracks, incrementTrackPlay } from '~/lib/music';

export const runtime = 'nodejs';
export const maxDuration = 5;

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,118}$/;
const MAX_BODY_BYTES = 512;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'production') {
    return new NextResponse(null, { status: 204 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const slug =
    typeof body === 'object' && body !== null && 'slug' in body
      ? (body as { slug?: unknown }).slug
      : undefined;

  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const tracks = await getPublishedTracks();
  if (!tracks.some((track) => track.slug === slug)) {
    return NextResponse.json({ error: 'Track not found' }, { status: 400 });
  }

  const playCount = await incrementTrackPlay(slug);
  if (playCount === null) {
    return NextResponse.json({ error: 'Play failed' }, { status: 502 });
  }

  return NextResponse.json({ slug, playCount });
}
