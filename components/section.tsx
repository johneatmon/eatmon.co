import type { FC, HTMLProps } from 'react';
import slugify from 'slugify';
import smartypants from 'smartypants';

type SectionProps = HTMLProps<HTMLDivElement> & {
	title?: string;
};

const Section: FC<SectionProps> = ({ title, children, ...props }) => {
	const id = title ? slugify(title, { lower: true, strict: true }) : undefined;

	return (
		<section {...props} aria-labelledby={id}>
			{title && (
				<h2
					id={id}
					className='mb-6 text-lg font-semibold text-gray-50'
					dangerouslySetInnerHTML={{ __html: smartypants(title, 1) }}
				/>
			)}
			{children}
		</section>
	);
};

export default Section;
