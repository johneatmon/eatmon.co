import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import type { Thing, WithContext } from 'schema-dts';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toJsonLd<T extends Thing>(json: WithContext<T>) {
  return JSON.stringify(json);
}

export function siteUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eatmon.co';
  return new URL(path, base).href;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
