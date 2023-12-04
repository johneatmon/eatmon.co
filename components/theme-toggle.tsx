'use client';

import { LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import { cn } from '~/lib/utils';

const toggleOptions = [
	{
		value: 'system',
		icon: () => <LaptopIcon className='aspect-square w-4' />,
	},
	{
		value: 'dark',
		icon: () => <MoonIcon className='aspect-square w-4' />,
	},
	{
		value: 'light',
		icon: () => <SunIcon className='aspect-square w-4' />,
	},
];

export const ThemeToggleGroup: FC = () => {
	const { setTheme } = useTheme();

	return (
		<ToggleGroup.Root
			className='bg:white inline-flex max-w-max space-x-px rounded-full border border-gray-300 p-1 shadow-[0_2px_10px] shadow-black/10 dark:border-gray-800/80 dark:bg-black'
			type='single'
			defaultValue='system'
			aria-label='Toggle theme'
			onValueChange={(value) => setTheme(value)}
		>
			{toggleOptions.map(({ value, icon: Icon }, index) => (
				<ToggleGroup.Item
					key={index}
					className={cn(
						'flex aspect-square w-8 items-center justify-center rounded-full text-base leading-4 transition',
						'focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none',
						'text-gray-400  hover:bg-gray-200  dark:hover:bg-gray-800',
						'data-[state=on]:bg-gray-200 data-[state=on]:text-gray-950  dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-gray-50'
					)}
					value={value}
					aria-label={`${value} theme`}
				>
					<Icon />
				</ToggleGroup.Item>
			))}
		</ToggleGroup.Root>
	);
};
