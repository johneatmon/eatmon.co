import Link from 'next/link';
import { cn } from '~/lib/utils';

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header className={cn('flex items-end justify-between gap-6', className)}>
      <Link href="/" className="group no-underline">
        <span className="block font-sans text-[1.65rem] leading-none tracking-[-0.04em] text-(--foreground) transition-opacity duration-200 group-hover:opacity-70 sm:text-[2rem]">
          John Eatmon
        </span>
        <span className="mt-2 block text-[11px] tracking-[0.08em] text-(--muted) uppercase">
          Software Engineer · Seattle, WA
        </span>
      </Link>
      <nav
        aria-label="Primary"
        className="flex items-center gap-5 text-[11px] tracking-[0.08em] uppercase"
      >
        <Link
          href="/blog"
          className="link-fade no-underline text-(--muted) hover:text-(--foreground)"
        >
          Blog
        </Link>
        <Link
          href="/music"
          className="link-fade no-underline text-(--muted) hover:text-(--foreground)"
        >
          Music
        </Link>
        <Link
          href="/colophon"
          className="link-fade no-underline text-(--muted) hover:text-(--foreground)"
        >
          Colophon
        </Link>
      </nav>
    </header>
  );
}
