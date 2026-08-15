import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
      <p className="text-[11px] tracking-widest text-(--muted) uppercase">404</p>
      <h1 className="mt-4 text-4xl tracking-[-0.04em]">Page not found</h1>
      <p className="mt-4 max-w-md text-[color-mix(in_oklab,var(--foreground)_72%,transparent)]">
        That route does not exist. Head back home or browse the blog.
      </p>
      <div className="mt-8 flex gap-5 text-[11px] tracking-[0.08em] uppercase">
        <Link href="/" className="no-underline">
          Index
        </Link>
        <Link href="/blog" className="no-underline">
          Blog
        </Link>
      </div>
    </main>
  );
}
