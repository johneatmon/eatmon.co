import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const parseError = (error: unknown): string => {
	const message = error instanceof Error ? error.message : String(error);

	return message;
};
