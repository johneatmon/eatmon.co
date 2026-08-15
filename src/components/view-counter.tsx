'use client';

import { useEffect } from 'react';

const SESSION_KEY_PREFIX = 'viewed:';

export function ViewCounter({
  slug,
  views,
  track = false,
}: {
  slug: string;
  views: { slug: string; count: number | null }[];
  track?: boolean;
}) {
  const count = views.find((view) => view.slug === slug)?.count ?? 0;

  useEffect(() => {
    if (!track) return;

    try {
      const key = `${SESSION_KEY_PREFIX}${slug}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // sessionStorage may be unavailable; still attempt a single increment.
    }

    void fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    });
  }, [track, slug]);

  return <span>{Number(count).toLocaleString()} views</span>;
}
