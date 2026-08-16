-- Hearts on finished tracks + transferable unfinished upvotes.
-- vote_count is reused for both: hearts when finished, upvotes when unfinished.

create or replace function public.heart_finished_track(track_slug text)
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
    and status = 'finished'
  returning vote_count into new_count;

  if new_count is null then
    raise exception 'track not heartable';
  end if;

  return new_count;
end;
$$;

revoke all on function public.heart_finished_track(text) from public;
revoke all on function public.heart_finished_track(text) from anon, authenticated;
grant execute on function public.heart_finished_track(text) to service_role;

-- Cast or move a single unfinished upvote. previous_slug is the browser's prior pick.
create or replace function public.upvote_unfinished_track(
  track_slug text,
  previous_slug text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  to_count integer;
  from_count integer;
begin
  if track_slug is null
     or char_length(track_slug) < 1
     or char_length(track_slug) > 120
     or track_slug !~ '^[a-z0-9][a-z0-9-]{0,118}$' then
    raise exception 'invalid track slug';
  end if;

  if previous_slug is not null then
    if char_length(previous_slug) < 1
       or char_length(previous_slug) > 120
       or previous_slug !~ '^[a-z0-9][a-z0-9-]{0,118}$' then
      raise exception 'invalid previous slug';
    end if;
  end if;

  if previous_slug is not null and previous_slug = track_slug then
    select vote_count into to_count
    from public.tracks
    where slug = track_slug
      and published = true
      and status = 'unfinished';

    if to_count is null then
      raise exception 'track not votable';
    end if;

    return jsonb_build_object(
      'slug', track_slug,
      'voteCount', to_count,
      'previousSlug', null,
      'previousVoteCount', null
    );
  end if;

  if previous_slug is not null then
    update public.tracks
    set
      vote_count = greatest(vote_count - 1, 0),
      updated_at = now()
    where slug = previous_slug
      and published = true
      and status = 'unfinished'
    returning vote_count into from_count;
  end if;

  update public.tracks
  set
    vote_count = vote_count + 1,
    updated_at = now()
  where slug = track_slug
    and published = true
    and status = 'unfinished'
  returning vote_count into to_count;

  if to_count is null then
    raise exception 'track not votable';
  end if;

  return jsonb_build_object(
    'slug', track_slug,
    'voteCount', to_count,
    'previousSlug', previous_slug,
    'previousVoteCount', from_count
  );
end;
$$;

revoke all on function public.upvote_unfinished_track(text, text) from public;
revoke all on function public.upvote_unfinished_track(text, text) from anon, authenticated;
grant execute on function public.upvote_unfinished_track(text, text) to service_role;

-- Prefer the new RPCs; keep the old name as a thin wrapper for any lingering callers.
create or replace function public.increment_track_vote(track_slug text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  result := public.upvote_unfinished_track(track_slug, null);
  return (result ->> 'voteCount')::integer;
end;
$$;
