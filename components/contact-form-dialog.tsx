'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
	forwardRef,
	useId,
	useState,
	type FC,
	type FormEventHandler,
	type InputHTMLAttributes,
	type TextareaHTMLAttributes,
} from 'react';
import { sendEmail } from '~/lib/actions';
import useContactForm from '~/lib/use-contact-form';
import { cn, parseError } from '~/lib/utils';

const ContactFormDialog: FC = () => {
	const { open, setOpen } = useContactForm();

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-white/75 data-[state=open]:animate-overlayShow dark:bg-black/75' />
				<Dialog.Content
					className={cn(
						'fixed left-1/2 top-[40vh] grid w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 sm:top-1/2',
						'bg-white p-4 font-sans shadow-lg focus:outline-none dark:bg-gray-1000 sm:rounded-lg sm:p-6',
						'data-[state=open]:animate-contentShow'
					)}
				>
					<ContactForm />
					<Dialog.Close asChild>
						<button
							type='button'
							className={cn(
								'absolute right-3 top-3 inline-flex aspect-square w-6 appearance-none items-center justify-center rounded-full',
								'text-gray-500 transition hover:text-gray-700 dark:hover:text-gray-200',
								'focus:shadow-sm focus:shadow-black/50 focus:outline-none dark:focus:shadow-white/50'
							)}
							aria-label='Close'
						>
							<Cross2Icon />
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default ContactFormDialog;

const ContactForm: FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [sending, setSending] = useState(false);
	const [response, setResponse] = useState('');

	const handleSubmit: FormEventHandler = async (event) => {
		event.preventDefault();
		setSending(true);

		if (!name.trim() || !email.trim() || !message.trim()) {
			setResponse('Please fill out all fields');
			return;
		}

		try {
			const response = (await sendEmail({
				name,
				email,
				message,
			})) as string;

			setName('');
			setEmail('');
			setMessage('');

			console.log('Email response:', response);
			setResponse(response);

			setTimeout(() => {
				setResponse('');
			}, 5_000);
		} catch (error) {
			console.error('Error sending email:', error);
			const errorMessage = parseError(error);
			setResponse(errorMessage);
		} finally {
			setSending(false);
		}
	};

	return (
		<Form.Root className='flex w-full flex-col gap-4' onSubmit={handleSubmit}>
			{!!response && (
				<p className={cn('text-sm font-medium text-gray-950 dark:text-gray-50')}>&gt; {response}</p>
			)}
			<Input
				label='Name'
				value={name}
				onChangeText={setName}
				placeholder='Jane Doe'
				autoFocus
				hint={[
					{
						match: 'valueMissing',
						message: 'Please enter a name',
					},
				]}
				required
			/>
			<Input
				label='Email'
				value={email}
				onChangeText={setEmail}
				placeholder='janedoe@example.com'
				hint={[
					{
						match: 'valueMissing',
						message: 'Please enter an email address',
					},
					{
						match: 'typeMismatch',
						message: 'Please enter a valid email address',
					},
				]}
				required
			/>
			<TextArea
				label='Message (optional)'
				value={message}
				onChangeText={setMessage}
				placeholder='Hi John, I have a question about...'
				hint={[
					{
						match: 'tooLong',
						message: 'Message too long, must be <1,000 characters.',
					},
				]}
				rows={4}
				spellCheck
			/>
			<Form.Submit asChild>
				<button
					type='submit'
					disabled={sending || !name.trim() || !email.trim() || !message.trim()}
					className={cn(
						'inline-flex h-10 items-center justify-center rounded-md bg-gray-950 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-950 aria-disabled:opacity-50 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-950 sm:text-sm'
					)}
				>
					Submit
				</button>
			</Form.Submit>
		</Form.Root>
	);
};

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	hint?: Array<{
		match?:
			| 'valueMissing'
			| 'badInput'
			| 'patternMismatch'
			| 'rangeOverflow'
			| 'rangeUnderflow'
			| 'stepMismatch'
			| 'tooLong'
			| 'tooShort'
			| 'typeMismatch';
		message: string;
	}>;
	onChangeText?: (value: string) => void;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, onChangeText, ...props }, ref) => {
		const id = useId();

		const handleChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = (event) => {
			props.onChange?.(event);
			onChangeText?.(event.target.value);
		};

		return (
			<div className='grid w-full items-center gap-1.5'>
				<Form.Field className='grid' name='question'>
					<div className='flex items-baseline justify-between'>
						{props.label && (
							<Form.Label htmlFor={id} className='mb-1.5 text-gray-950 dark:text-gray-50'>
								{props.label}
							</Form.Label>
						)}
						{props.hint?.length && (
							<>
								{props.hint.map(({ match, message }, index) => (
									<Form.Message key={index} className='text-sm text-red-500' match={match}>
										{message}
									</Form.Message>
								))}
							</>
						)}
					</div>
					<Form.Control asChild>
						<input
							id={id}
							className={cn(
								'h-10 w-full rounded-md px-3 py-2 text-base transition-shadow',
								'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-950',
								'border border-gray-300 dark:border-gray-700',
								'disabled:cursor-not-allowed disabled:opacity-50',
								'bg-transparent placeholder:text-gray-400 dark:text-gray-50',
								className
							)}
							ref={ref}
							onChange={handleChange}
							{...props}
						/>
					</Form.Control>
				</Form.Field>
			</div>
		);
	}
);

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	hint?: Array<{
		match?:
			| 'valueMissing'
			| 'badInput'
			| 'patternMismatch'
			| 'rangeOverflow'
			| 'rangeUnderflow'
			| 'stepMismatch'
			| 'tooLong'
			| 'tooShort'
			| 'typeMismatch';
		message: string;
	}>;
	onChangeText?: (text: string) => void;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, onChangeText, ...props }, ref) => {
		const id = useId();

		const handleChange: TextareaHTMLAttributes<HTMLTextAreaElement>['onChange'] = (event) => {
			props.onChange?.(event);
			onChangeText?.(event.target.value);
		};

		return (
			<div className='grid w-full items-center gap-1.5'>
				<Form.Field className='grid' name='question'>
					<div className='flex items-baseline justify-between'>
						{props.label && (
							<Form.Label htmlFor={id} className='mb-1.5 text-gray-950 dark:text-gray-50'>
								{props.label}
							</Form.Label>
						)}
						{props.hint?.length && (
							<>
								{props.hint.map(({ match, message }, index) => (
									<Form.Message key={index} className='text-sm text-red-500' match={match}>
										{message}
									</Form.Message>
								))}
							</>
						)}
					</div>
					<Form.Control asChild>
						<textarea
							id={id}
							className={cn(
								'max-h-40 min-h-[80px] w-full rounded-md px-3 py-2 text-base transition-shadow',
								'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-950',
								'border border-gray-300 dark:border-gray-700',
								'disabled:cursor-not-allowed disabled:opacity-50',
								'bg-transparent placeholder:text-gray-400 dark:text-gray-50',
								className
							)}
							ref={ref}
							onChange={handleChange}
							{...props}
						/>
					</Form.Control>
				</Form.Field>
			</div>
		);
	}
);
