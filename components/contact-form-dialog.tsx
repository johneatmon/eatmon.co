'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { Cross2Icon } from '@radix-ui/react-icons';
import { forwardRef, useId, useState, type FC, type InputHTMLAttributes } from 'react';
import useContactForm from '~/lib/use-contact-form';
import { cn } from '~/lib/utils';

const ContactFormDialog: FC = () => {
	const { open, setOpen } = useContactForm();

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 bg-black/75 data-[state=open]:animate-overlayShow' />
				<Dialog.Content
					className={cn(
						'fixed left-1/2 top-1/2 grid w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-4',
						'bg-white p-4 font-sans shadow-lg focus:outline-none dark:bg-gray-1000 sm:rounded-lg sm:p-6',
						'data-[state=open]:animate-contentShow'
					)}
				>
					<Dialog.Title className='font-medium text-gray-950 dark:text-gray-50'>
						Get in touch
					</Dialog.Title>
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

	return (
		<Form.Root className='flex w-full flex-col gap-4'>
			<Input
				label='Name'
				value={name}
				onChangeText={setName}
				placeholder='Jane Doe'
				autoFocus
				required
			/>
			<Input
				label='Email'
				value={email}
				onChangeText={setEmail}
				placeholder='janedoe@example.com'
				required
			/>
			{/* <Form.Field className='grid' name='email'>
				<div className='flex items-baseline justify-between'>
					<Form.Label className='mb-1.5 text-gray-950 dark:text-gray-50'>Email</Form.Label>
					<Form.Message className='text-sm text-white opacity-[0.8]' match='valueMissing'>
						Please enter your email
					</Form.Message>
					<Form.Message className='text-sm text-white opacity-[0.8]' match='typeMismatch'>
						Please provide a valid email
					</Form.Message>
				</div>
				<Form.Control asChild>
					<input
						type='email'
						required
						className={cn(
							'flex h-10 w-full rounded-md px-3 py-2 text-base transition-shadow',
							'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-950',
							'border border-gray-300 dark:border-gray-700',
							'disabled:cursor-not-allowed disabled:opacity-50',
							'bg-transparent placeholder:text-gray-400 dark:text-gray-50'
						)}
					/>
				</Form.Control>
			</Form.Field> */}
			<Form.Field className='grid' name='question'>
				<div className='flex items-baseline justify-between'>
					<Form.Label className='mb-1.5 text-gray-950 dark:text-gray-50'>Message</Form.Label>
					<Form.Message className='text-sm text-white opacity-[0.8]' match='valueMissing'>
						Please enter a question
					</Form.Message>
				</div>
				<Form.Control asChild>
					<textarea
						rows={4}
						placeholder='Hi John, I have a question about...'
						spellCheck
						className={cn(
							'max-h-40 min-h-[80px] w-full rounded-md px-3 py-2 text-base transition-shadow',
							'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-950',
							'border border-gray-300 dark:border-gray-700',
							'disabled:cursor-not-allowed disabled:opacity-50',
							'bg-transparent placeholder:text-gray-400 dark:text-gray-50'
						)}
					/>
				</Form.Control>
			</Form.Field>
			<Form.Submit asChild>
				<button
					type='submit'
					className={cn(
						'inline-flex h-10 items-center justify-center rounded-md bg-gray-950 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-950 dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-gray-200 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-950 sm:text-sm'
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
	hint?: string;
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
						{props.hint && (
							<Form.Message className='text-sm text-red-500 opacity-[0.8]'>
								{props.hint}
							</Form.Message>
						)}
						{/* <Form.Message match='valueMissing'>Please enter a question</Form.Message> */}
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
