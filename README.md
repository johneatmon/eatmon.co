# eatmon.co

Personal site — Next.js, MDX, Tailwind CSS. Hosted on Vercel.

## Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in values.

```bash
pnpm dev
```

Requires Node 24+.

## Blog views

Views are stored in Supabase (`views` table) and incremented only in production via
`POST /api/views`. Apply migrations under `supabase/migrations/` before deploying.

Client `sessionStorage` dedupes once per browser tab session. For platform rate
limiting on Hobby (1 rule per project):

1. Vercel → Project → Firewall → Configure → New Rule
2. If: Request Method equals `POST` **and** Request Path equals `/api/views`
3. Then: Rate Limit → Fixed window → e.g. 10 requests / 60s → action **429**
4. Save and publish (no redeploy required)

## Copyright

Site content is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Code is licensed under [MIT](https://opensource.org/licenses/MIT).
