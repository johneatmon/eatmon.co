'use server';

import { render } from '@react-email/render';
import { eq } from 'drizzle-orm';
import { ReactElement } from 'react';
import { Resend } from 'resend';
import { z } from 'zod';
import { views } from '~/drizzle/schema';
import { ContactTemplate as template } from '~/emails/contact';
import { db } from '~/lib/planetscale';

export async function increment(slug: string) {
	// const data = await db.selectFrom('views').where('slug', '=', slug).select(['count']).execute();
	const data = await db.select({ count: views.count }).from(views).where(eq(views.slug, slug));
	const blogViews = !data.length ? 0 : Number(data[0].count);

	// await db
	// 	.insertInto('views')
	// 	.values({ slug, count: 1 })
	// 	.onDuplicateKeyUpdate({ count: blogViews + 1 })
	// 	.execute();
	await db
		.insert(views)
		.values({ slug, count: 1 })
		.onDuplicateKeyUpdate({ set: { count: blogViews + 1 } });
	return;
}

if (!process.env.RESEND_API_KEY) {
	throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (prevState: unknown, formData: FormData): Promise<{ error?: string }> => {
	const schema = z.object({
		email: z.string().email(),
		name: z.string().min(1).max(100),
		message: z.string().min(0).max(1000).optional(),
	});

	const { email, name, message } = schema.parse({
		email: formData.get('email'),
		name: formData.get('name'),
		message: formData.get('message'),
	});

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

		return {};
	} catch (error: unknown) {
		if (error instanceof Error) {
			return { error: error.message };
		} else {
			return { error: 'Unknown error' };
		}
	}
};
