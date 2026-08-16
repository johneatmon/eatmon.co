-- Finished vs unfinished tracks + public vote counts for unfinished work.

alter table public.tracks
  add column if not exists status text not null default 'unfinished',
  add column if not exists vote_count integer not null default 0;

alter table public.tracks
  drop constraint if exists tracks_status_check;

alter table public.tracks
  add constraint tracks_status_check
  check (status in ('finished', 'unfinished'));

alter table public.tracks
  drop constraint if exists tracks_vote_count_nonnegative;

alter table public.tracks
  add constraint tracks_vote_count_nonnegative
  check (vote_count >= 0);

-- Unfinished catalog ranked by votes; finished by sort_order.
create index if not exists tracks_unfinished_votes_idx
  on public.tracks (vote_count desc, published_at desc)
  where published = true and status = 'unfinished';

create index if not exists tracks_finished_sort_idx
  on public.tracks (sort_order asc, published_at desc)
  where published = true and status = 'finished';

create or replace function public.increment_track_vote(track_slug text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  if track_slug is null
     or char_length(track_slug) < 1
     or char_length(track_slug) > 120
     or track_slug !~ '^[a-z0-9][a-z0-9-]{0,118}$' then
    raise exception 'invalid track slug';
  end if;

  update public.tracks
  set
    vote_count = vote_count + 1,
    updated_at = now()
  where slug = track_slug
    and published = true
    and status = 'unfinished'
  returning vote_count into new_count;

  if new_count is null then
    raise exception 'track not votable';
  end if;

  return new_count;
end;
$$;

revoke all on function public.increment_track_vote(text) from public;
revoke all on function public.increment_track_vote(text) from anon, authenticated;
grant execute on function public.increment_track_vote(text) to service_role;
