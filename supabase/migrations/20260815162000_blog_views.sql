create table if not exists public.views (
  slug text primary key,
  count integer not null default 0
);

create or replace function public.increment_view(view_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.views (slug, count)
  values (view_slug, 1)
  on conflict (slug)
  do update set count = public.views.count + 1;
$$;

revoke all on function public.increment_view(text) from public;
