import { render } from '@react-email/render';
import type { ReactElement } from 'react';
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

export async function POST(request: Request) {
	try {
		if (!process.env.RESEND_API_KEY) {
			throw new Error('Missing RESEND_API_KEY environment variable');
		}

		const { name, email, message } = await request.json();
		const validatedData = schema.safeParse({ name, email, message });

		if (!validatedData.success) {
			const errors = Object.values(validatedData.error.flatten().fieldErrors);
			const errorMessage = errors.flatMap((error) => error).join(', ');
			throw new Error(errorMessage);
		}

		const resend = new Resend(process.env.RESEND_API_KEY);
		const avatar = `https://www.gravatar.com/avatar/${Buffer.from(email).toString(
			'hex'
		)}?s=100&d=mp`;
		const react = template({
			name,
			email,
			avatar,
			message,
		}) as ReactElement;
		const text = render(react, { plainText: true });

		await resend.sendEmail({
			from: 'noreply@eatmon.co',
			to: 'john@eatmon.co',
			subject: `Contact form submission from ${name}`,
			reply_to: email,
			react,
			text,
		});

		return Response.json('Message successfully sent', { status: 200 });
	} catch (error: unknown) {
		const errorMessage = parseError(error);
		return Response.json(errorMessage, { status: 500 });
	}
}
