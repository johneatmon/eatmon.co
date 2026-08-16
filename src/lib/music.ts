import { cache } from 'react';
import 'server-only';

export type TrackStatus = 'finished' | 'unfinished';

export type Track = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  durationSec: number;
  peaks: number[];
  audioPath: string;
  audioUrl: string;
  sortOrder: number;
  status: TrackStatus;
  voteCount: number;
  publishedAt: string;
};

export type ReactionResult = {
  slug: string;
  voteCount: number;
  previousSlug: string | null;
  previousVoteCount: number | null;
};

type TrackRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration_sec: number | string;
  peaks: unknown;
  audio_path: string;
  sort_order: number;
  status: string;
  vote_count: number | string;
  published_at: string;
};

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

function headers(secretKey: string) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
  };
}

function publicAudioUrl(audioPath: string) {
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/music/${audioPath}`;
}

function normalizePeaks(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => Number(entry))
    .filter((entry) => Number.isFinite(entry))
    .map((entry) => Math.min(1, Math.max(0, entry)));
}

function mapStatus(value: string): TrackStatus {
  return value === 'finished' ? 'finished' : 'unfinished';
}

function mapTrack(row: TrackRow): Track {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    durationSec: Number(row.duration_sec),
    peaks: normalizePeaks(row.peaks),
    audioPath: row.audio_path,
    audioUrl: publicAudioUrl(row.audio_path),
    sortOrder: Number(row.sort_order),
    status: mapStatus(row.status),
    voteCount: Number(row.vote_count) || 0,
    publishedAt: row.published_at,
  };
}

function isValidSlug(slug: string) {
  return typeof slug === 'string' && slug.length >= 1 && slug.length <= 120;
}

export const getPublishedTracks = cache(async (): Promise<Track[]> => {
  if (!supabaseUrl || !supabaseSecretKey) return [];

  try {
    const query = new URLSearchParams({
      select:
        'id,slug,title,description,duration_sec,peaks,audio_path,sort_order,status,vote_count,published_at',
      published: 'eq.true',
      order: 'status.asc,sort_order.asc,published_at.desc',
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/tracks?${query}`, {
      headers: headers(supabaseSecretKey),
      next: { revalidate: 30 },
    });

    if (!response.ok) return [];

    const rows = (await response.json()) as TrackRow[];
    return rows.map(mapTrack).filter((track) => track.audioUrl && track.peaks.length > 0);
  } catch {
    return [];
  }
});

export async function heartFinishedTrack(slug: string): Promise<ReactionResult | null> {
  if (!supabaseUrl || !supabaseSecretKey || !isValidSlug(slug)) return null;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/heart_finished_track`, {
      method: 'POST',
      headers: {
        ...headers(supabaseSecretKey),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ track_slug: slug }),
    });

    if (!response.ok) return null;
    const count = (await response.json()) as number;
    if (!Number.isFinite(count)) return null;
    return { slug, voteCount: count, previousSlug: null, previousVoteCount: null };
  } catch {
    return null;
  }
}

export async function upvoteUnfinishedTrack(
  slug: string,
  previousSlug: string | null = null,
): Promise<ReactionResult | null> {
  if (!supabaseUrl || !supabaseSecretKey || !isValidSlug(slug)) return null;
  if (previousSlug !== null && !isValidSlug(previousSlug)) return null;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/upvote_unfinished_track`, {
      method: 'POST',
      headers: {
        ...headers(supabaseSecretKey),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        track_slug: slug,
        previous_slug: previousSlug,
      }),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as {
      slug?: unknown;
      voteCount?: unknown;
      previousSlug?: unknown;
      previousVoteCount?: unknown;
    };

    if (typeof data.slug !== 'string' || typeof data.voteCount !== 'number') return null;

    return {
      slug: data.slug,
      voteCount: data.voteCount,
      previousSlug: typeof data.previousSlug === 'string' ? data.previousSlug : null,
      previousVoteCount: typeof data.previousVoteCount === 'number' ? data.previousVoteCount : null,
    };
  } catch {
    return null;
  }
}

export function partitionTracks(tracks: Track[]) {
  const finished = tracks
    .filter((track) => track.status === 'finished')
    .sort((a, b) => a.sortOrder - b.sortOrder || b.publishedAt.localeCompare(a.publishedAt));

  const unfinished = tracks
    .filter((track) => track.status === 'unfinished')
    .sort((a, b) => a.sortOrder - b.sortOrder || b.publishedAt.localeCompare(a.publishedAt));

  return { finished, unfinished };
}
