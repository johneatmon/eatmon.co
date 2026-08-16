-- Music catalog: tracks metadata + public Storage bucket for MP3s.
-- App reads via service role (mirrors views); Storage objects are publicly readable.

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  description text,
  duration_sec numeric(10, 3) not null,
  peaks jsonb not null default '[]'::jsonb,
  audio_path text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tracks_slug_length_check check (char_length(slug) between 1 and 120),
  constraint tracks_slug_format_check check (slug ~ '^[a-z0-9][a-z0-9-]{0,118}$'),
  constraint tracks_title_length_check check (char_length(title) between 1 and 200),
  constraint tracks_duration_positive check (duration_sec > 0),
  constraint tracks_audio_path_length_check check (char_length(audio_path) between 1 and 500)
);

create unique index if not exists tracks_slug_uidx on public.tracks (slug);

create index if not exists tracks_published_sort_idx
  on public.tracks (sort_order asc, published_at desc)
  where published = true;

alter table public.tracks enable row level security;
alter table public.tracks force row level security;

revoke all on table public.tracks from public;
revoke all on table public.tracks from anon, authenticated;
grant select, insert, update, delete on table public.tracks to service_role;

-- Public bucket for streaming audio (writes only via service role / dashboard).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'music',
  'music',
  true,
  52428800, -- 50 MB
  array['audio/mpeg', 'audio/mp3']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read of objects in the music bucket.
drop policy if exists "Public read music objects" on storage.objects;
create policy "Public read music objects"
  on storage.objects
  for select
  to public
  using (bucket_id = 'music');

-- No anon/authenticated write policies — uploads use the service role key.
