import Link from 'next/link';
import { ThemeToggle } from '~/components/theme-toggle';
import { socials } from '~/lib/site';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-(--border)">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-10 sm:px-8">
        <ThemeToggle />
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] tracking-[0.08em] text-(--muted) uppercase">
              &copy; {new Date().getFullYear()} John Eatmon
            </p>
          </div>
          <ul className="flex items-center gap-5 text-[11px] tracking-[0.08em] uppercase">
            <li>
              <Link
                href="/colophon"
                className="link-fade no-underline text-(--muted) hover:text-(--foreground)"
              >
                Colophon
              </Link>
            </li>
            {socials.map(({ name, href }) => (
              <li key={name}>
                <a
                  href={href}
                  className="link-fade no-underline text-(--muted) hover:text-(--foreground)"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
