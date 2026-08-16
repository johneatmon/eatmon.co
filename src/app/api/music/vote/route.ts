import { NextResponse } from 'next/server';
import { getPublishedTracks, heartFinishedTrack, upvoteUnfinishedTrack } from '~/lib/music';

export const runtime = 'nodejs';
export const maxDuration = 5;

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,118}$/;
const MAX_BODY_BYTES = 512;

function readSlug(value: unknown) {
  return typeof value === 'string' && SLUG_PATTERN.test(value) ? value : null;
}

export async function POST(request: Request) {
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

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const payload = body as { slug?: unknown; previousSlug?: unknown };
  const slug = readSlug(payload.slug);
  if (!slug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const previousSlug =
    payload.previousSlug === null || payload.previousSlug === undefined
      ? null
      : readSlug(payload.previousSlug);

  if (payload.previousSlug !== null && payload.previousSlug !== undefined && !previousSlug) {
    return NextResponse.json({ error: 'Invalid previous slug' }, { status: 400 });
  }

  const tracks = await getPublishedTracks();
  const track = tracks.find((entry) => entry.slug === slug);
  if (!track) {
    return NextResponse.json({ error: 'Track not found' }, { status: 400 });
  }

  if (track.status === 'finished') {
    if (previousSlug) {
      return NextResponse.json({ error: 'Hearts cannot transfer' }, { status: 400 });
    }
    const result = await heartFinishedTrack(slug);
    if (!result) {
      return NextResponse.json({ error: 'Heart failed' }, { status: 502 });
    }
    return NextResponse.json(result);
  }

  if (previousSlug) {
    const previous = tracks.find((entry) => entry.slug === previousSlug);
    if (previous?.status !== 'unfinished') {
      return NextResponse.json({ error: 'Invalid previous vote' }, { status: 400 });
    }
  }

  const result = await upvoteUnfinishedTrack(slug, previousSlug);
  if (!result) {
    return NextResponse.json({ error: 'Upvote failed' }, { status: 502 });
  }

  return NextResponse.json(result);
}
