-- Harden views: length constraint + RLS (server secret role only).
alter table public.views
  alter column slug type text,
  alter column slug set not null;

alter table public.views
  drop constraint if exists views_slug_length_check;

alter table public.views
  add constraint views_slug_length_check
  check (char_length(slug) between 1 and 200);

create or replace function public.increment_view(view_slug text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if view_slug is null
     or char_length(view_slug) < 1
     or char_length(view_slug) > 200
     or view_slug !~ '^/blog/[a-z0-9][a-z0-9-]{0,180}$' then
    raise exception 'invalid view slug';
  end if;

  insert into public.views (slug, count)
  values (view_slug, 1)
  on conflict (slug)
  do update set count = public.views.count + 1;
end;
$$;

revoke all on function public.increment_view(text) from public;
revoke all on function public.increment_view(text) from anon, authenticated;
grant execute on function public.increment_view(text) to service_role;

alter table public.views enable row level security;
alter table public.views force row level security;

-- No policies for anon/authenticated: app uses SUPABASE_SECRET_KEY (service role).
revoke all on table public.views from public;
revoke all on table public.views from anon, authenticated;
grant select, insert, update on table public.views to service_role;
