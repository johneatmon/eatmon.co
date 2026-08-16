-- Play counts for published tracks (incremented only from production via service role).

alter table public.tracks
  add column if not exists play_count integer not null default 0;

alter table public.tracks
  drop constraint if exists tracks_play_count_nonnegative;

alter table public.tracks
  add constraint tracks_play_count_nonnegative
  check (play_count >= 0);

create or replace function public.increment_track_play(track_slug text)
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
    play_count = play_count + 1,
    updated_at = now()
  where slug = track_slug
    and published = true
  returning play_count into new_count;

  if new_count is null then
    raise exception 'track not playable';
  end if;

  return new_count;
end;
$$;

revoke all on function public.increment_track_play(text) from public;
revoke all on function public.increment_track_play(text) from anon, authenticated;
grant execute on function public.increment_track_play(text) to service_role;
