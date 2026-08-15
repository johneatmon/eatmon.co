import { NextResponse } from 'next/server';
import { incrementView } from '~/lib/db';
import { getAllPosts } from '~/lib/posts';

export const runtime = 'nodejs';
export const maxDuration = 5;

const VIEW_SLUG_PATTERN = /^\/blog\/[a-z0-9][a-z0-9-]{0,180}$/;
const MAX_BODY_BYTES = 512;

function isKnownPostSlug(viewSlug: string) {
  if (!VIEW_SLUG_PATTERN.test(viewSlug) || viewSlug.length > 200) return false;
  const postSlug = viewSlug.slice('/blog/'.length);
  return getAllPosts().some((post) => post.slug === postSlug);
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

  const slug =
    typeof body === 'object' && body !== null && 'slug' in body
      ? (body as { slug?: unknown }).slug
      : undefined;

  if (typeof slug !== 'string' || !isKnownPostSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  await incrementView(slug);
  return new NextResponse(null, { status: 204 });
}
