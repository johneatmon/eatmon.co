import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import { Font } from '@react-email/font';
import type { FC } from 'react';
import smartypants from 'smartypants';

type ContactTemplateProps = {
	readonly name: string;
	readonly email: string;
	readonly message: string | undefined;
	readonly avatar: string;
};

export const ContactTemplate: FC<ContactTemplateProps> = ({ name, email, message, avatar }) => (
	<Html lang='en'>
		<Head>
			<Font
				fontFamily='IBM Plex Sans'
				fallbackFontFamily={['Helvetica', 'sans-serif']}
				webFont={{
					url: 'https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKhdHeFaxOedc.woff2',
					format: 'woff2',
				}}
				fontWeight={400}
				fontStyle='normal'
			/>
		</Head>
		<Preview>New message from {name}</Preview>
		<Tailwind>
			<Body className='mx-auto my-auto bg-white font-sans'>
				<Container className='mx-auto my-10 w-[465px] rounded border border-solid border-black/5 bg-white p-5'>
					<Section className='mt-8'>
						<Img
							src={avatar}
							width='40'
							height='40'
							alt={`Gravatar for ${name}`}
							className='my-0 overflow-hidden rounded-full'
						/>
					</Section>
					<Heading className='mx-0 mt-8 p-0 text-2xl font-normal text-black'>
						New message from {name} ({email})
					</Heading>
					{message && (
						<Text
							className='text-base leading-6 text-black'
							dangerouslySetInnerHTML={{ __html: smartypants(message, 1) }}
						/>
					)}
					<Hr className='mx-0 my-6 w-full bg-gray-200' />
					<Text className='text-sm leading-6 text-gray-500'>
						This message was sent via the contact form on eatmon.co
					</Text>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

const ContactTemplateDemo: FC = () => (
	<ContactTemplate
		name='John Eatmon'
		email='john@eatmon.co'
		avatar='https://eatmon.co/cdn-cgi/imagedelivery/le40TwFDWUdIvXckEp8FBw/me_and_adams.png/square'
		message="We've been talking about cool, and its ramifications, and how it applies to the hip scene. But maybe you can give us some examples now of the opposite of cool -- uncool. And just exactly what is uncool?"
	/>
);

/** @public */
export default ContactTemplateDemo;
