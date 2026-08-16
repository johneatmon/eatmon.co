-- Public buckets serve known object URLs without a SELECT list policy.
-- Dropping this removes Storage directory listing while keeping streaming intact.

drop policy if exists "Public read music objects" on storage.objects;
