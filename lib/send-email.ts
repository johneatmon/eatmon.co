'use server';

import { render } from '@react-email/render';
import { ReactElement } from 'react';
import { Resend } from 'resend';
import sanitize from 'sanitize-html';
import { z } from 'zod';
import { ContactTemplate as template } from '~/emails/contact';
import { parseError } from '~/lib/utils';

const schema = z.object({
	email: z.string().email().min(1),
	name: z.string().min(1).max(100),
	message: z
		.string()
		.min(0)
		.max(1000)
		.transform((value) => sanitize(value)),
});

export const sendEmail = async (data: {
	name: string;
	email: string;
	message: string;
}): Promise<string> => {
	if (!process.env.RESEND_API_KEY) {
		throw new Error('Missing RESEND_API_KEY environment variable');
	}

	const resend = new Resend(process.env.RESEND_API_KEY);
	const validatedData = schema.safeParse(data);

	if (!validatedData.success) {
		return String(validatedData.error.flatten().fieldErrors);
	}

	const { name, email, message } = validatedData.data;
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
