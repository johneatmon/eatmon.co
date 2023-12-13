'use server';

import { render } from '@react-email/render';
import { eq } from 'drizzle-orm';
import type { ReactElement } from 'react';
import sanitize from 'sanitize-html';
import { z } from 'zod';
import { views } from '~/drizzle/schema';
import { ContactTemplate as template } from '~/emails/contact';
import { db } from '~/lib/planetscale';
import { parseError } from '~/lib/utils';

export async function increment(slug: string) {
	const data = await db.select({ count: views.count }).from(views).where(eq(views.slug, slug));
	const blogViews = !data.length ? 0 : Number(data[0].count);

	await db
		.insert(views)
		.values({ slug, count: 1 })
		.onDuplicateKeyUpdate({ set: { count: blogViews + 1 } });

	return;
}

const schema = z.object({
	email: z.string().email().min(1),
	name: z.string().min(1).max(100),
	message: z
		.string()
		.min(0)
		.max(1000)
		.transform((value) => sanitize(value)),
});

export type EmailResponse = { success: string } | { error: string };

export const sendEmail = async ({
	name,
	email,
	message,
}: {
	name: string;
	email: string;
	message: string;
}): Promise<EmailResponse> => {
	try {
		if (!process.env.RESEND_API_KEY) {
			throw new Error('Missing RESEND_API_KEY environment variable');
		}

		const validatedData = schema.safeParse({ name, email, message });

		if (!validatedData.success) {
			const errors = Object.values(validatedData.error.flatten().fieldErrors);
			const errorMessage = errors.flatMap((error) => error).join(', ');
			throw new Error(errorMessage);
		}

		const avatar = `https://www.gravatar.com/avatar/${Buffer.from(email).toString(
			'hex'
		)}?s=100&d=mp`;
		const react = template({
			name,
			email,
			avatar,
			message,
		}) as ReactElement;
		const html = render(react, { pretty: true });

		const response = await fetch(`https://api.resend.com/emails`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: 'eatmon.co <noreply@eatmon.co>',
				to: ['John Eatmon <john@eatmon.co>'],
				subject: `Contact form submission from ${name}`,
				reply_to: `${name} <${email}>`,
				html,
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to send email');
		}

		return { success: 'Message successfully sent' };
	} catch (error: unknown) {
		const errorMessage = parseError(error);
		return { error: errorMessage };
	}
};
