'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { cn } from '~/lib/utils';

const options = [
  { value: 'system', label: 'System' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
] as const;

function subscribe() {
  return () => {};
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <fieldset
      aria-label="Color theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-(--border) p-1 max-w-max"
    >
      {options.map(({ value, label }) => {
        const active = mounted && theme === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={cn(
              'relative rounded-full px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors duration-200',
              active
                ? 'bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)] text-(--foreground)'
                : 'text-(--muted) hover:text-(--foreground)',
            )}
          >
            {label}
          </button>
        );
      })}
    </fieldset>
  );
}
