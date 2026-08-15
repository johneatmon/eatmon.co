import { cache } from 'react';
import 'server-only';

type View = {
  slug: string;
  count: number;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

function headers(secretKey: string) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
  };
}

export const getTotalBlogViews = cache(async () => {
  const views = await getViewsCount();
  return views.reduce((total, view) => total + view.count, 0);
});

export const getViewsCount = cache(async (): Promise<View[]> => {
  if (!supabaseUrl || !supabaseSecretKey) return [];

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/views?select=slug,count`, {
      headers: headers(supabaseSecretKey),
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const views = (await response.json()) as View[];
    return views.map((view) => ({ ...view, count: Number(view.count) }));
  } catch {
    return [];
  }
});

export async function incrementView(slug: string) {
  if (process.env.NODE_ENV !== 'production') return;
  if (!supabaseUrl || !supabaseSecretKey) return;
  if (typeof slug !== 'string' || slug.length < 1 || slug.length > 200) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/rpc/increment_view`, {
      method: 'POST',
      headers: {
        ...headers(supabaseSecretKey),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ view_slug: slug }),
    });
  } catch {
    // View counts are best-effort.
  }
}
