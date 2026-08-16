# eatmon.co

Personal site — Next.js, MDX, Tailwind CSS. Hosted on Vercel.

## Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in values.

```bash
pnpm auth:github-packages   # once: GitHub Packages auth for private fonts
pnpm dev
```

Requires Node 24+.

## Blog views

Views are stored in Supabase (`views` table) and incremented only in production via
`POST /api/views`. Apply migrations under `supabase/migrations/` before deploying.

Client `sessionStorage` dedupes once per browser tab session. For platform rate
limiting on Hobby (1 rate-limit rule per project; extra rules can still `deny` /
`challenge`):

1. Vercel → Project → Firewall → Configure → New Rule
2. If: Request Method equals `POST` **and** Request Path starts with `/api/`
   (covers `/api/views`, `/api/music/vote`, and any future mutation routes)
3. Then: Rate Limit → Fixed window → e.g. 10 requests / 60s → action **429**
4. Save and publish (no redeploy required)

`vercel.ts` already denies non-POST methods on those endpoints at the edge.

## Music

Tracks live in Supabase (`tracks` table + public `music` Storage bucket). Apply the
music migrations, then drop audio into `./music` (gitignored) and ingest:

```bash
# macOS
brew install audiowaveform ffmpeg

# Batch: every .wav / .aiff / .flac / .m4a / .mp3 / … in ./music
pnpm music:upload

# Single file (title defaults from filename)
pnpm music:upload -- --file ./music/sketch.wav --title "Sketch Title"
pnpm music:upload -- --finished          # mark batch as finished
pnpm music:upload -- --keep              # keep local sources after upload
```

Non-MP3 sources are converted with `ffmpeg` (`libmp3lame -q:a 2`). After a successful
upload the source under `./music` is deleted (override with `--keep`).
`/music` splits **Finished** and **Unfinished** (both by `sort_order`, then publish date).
Votes update tallies in place — they do not reorder the list.
Finished tracks take hearts (one per browser per track). Unfinished tracks take a
single transferable upvote per browser — clicking another unfinished track moves the
vote (`POST /api/music/vote` with optional `previousSlug`). Client state lives in
`localStorage`; the server RPC decrements the previous unfinished row and increments
the new one.

## Copyright

Site content is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Code is licensed under [MIT](https://opensource.org/licenses/MIT).
