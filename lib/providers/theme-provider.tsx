'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import type { FC } from 'react';

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => (
	<NextThemesProvider {...props}>{children}</NextThemesProvider>
);
