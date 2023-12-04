# eatmon.co

My personal website, built with Next.js and hosted by Vercel.

## Installation

```bash
pnpm install
```

Copy the `.env.example` file to `.env.local` and fill in the values.

> [!IMPORTANT]
> You will also need to remove the `@johneatmon/gestura-text` dependency from `package.json` because it's a [private GitHub NPM Registry package](https://eatmon.co/blog/font-files-github-npm-registry/).

Start the local development server:

```bash
pnpm dev
```

## Copyright

My website content is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). All code is licensed under [MIT](https://opensource.org/licenses/MIT).
