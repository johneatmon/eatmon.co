'use server';

import { render } from '@react-email/render';
import { ReactElement } from 'react';
import { Resend } from 'resend';
import { ContactTemplate as template } from '~/emails/contact';
import { parseError } from '~/lib/utils';

export const sendEmail = async ({
	name,
	email,
	message,
}: {
	name: string;
	email: string;
	message: string;
}): Promise<string> => {
	if (!process.env.RESEND_API_KEY) {
		throw new Error('Missing RESEND_API_KEY environment variable');
	}

	const resend = new Resend(process.env.RESEND_API_KEY);
	const avatar = `https://www.gravatar.com/avatar/${Buffer.from(email).toString('hex')}?s=100&d=mp`;
	const react = template({
		name,
		email,
		avatar,
		message,
	}) as ReactElement;
	const text = render(react, { plainText: true });

	try {
		await resend.sendEmail({
			from: 'noreply@eatmon.co',
			to: 'john@eatmon.co',
			subject: `Contact form submission from ${name}`,
			reply_to: email,
			react,
			text,
		});

		return 'Message sent successfully';
	} catch (error: unknown) {
		const errorMessage = parseError(error);
		return errorMessage;
	}
};
