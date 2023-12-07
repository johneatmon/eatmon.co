'use client';

import { ChatBubbleIcon } from '@radix-ui/react-icons';
import type { FC } from 'react';
import useContactForm from '~/lib/use-contact-form';
import { cn } from '~/lib/utils';

const ContactButton: FC = () => {
	const { setOpen } = useContactForm();

	return (
		<button
			type='button'
			className={cn(
				'grid aspect-square w-8 place-items-center transition',
				'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
			)}
			aria-label='Get in touch'
			onClick={() => setOpen(true)}
		>
			<ChatBubbleIcon width={24} height={24} />
		</button>
	);
};

export default ContactButton;
