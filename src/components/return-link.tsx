import Link from 'next/link';
import { cn } from '~/lib/utils';

export function ReturnLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'link-fade inline-flex w-fit items-center gap-2 text-[11px] tracking-[0.08em] text-[var(--muted)] no-underline uppercase hover:text-[var(--foreground)]',
        className,
      )}
    >
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  );
}
