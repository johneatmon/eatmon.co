import BlurImage from '~/components/image';

const Header = () => {
	return (
		<header>
			<BlurImage
				src='https://eatmon.co/cdn-cgi/imagedelivery/le40TwFDWUdIvXckEp8FBw/499582c7-d0cd-49dc-8cf1-249ad7bef400/square'
				className='mb-4 aspect-square w-20 rounded-full transition-all dark:grayscale'
				alt='Grayscale headshot of John Eatmon with spicy blue Dune eyes and a filt-plug in his nose.'
				width={80}
				height={80}
				loading='eager'
			/>
			<small className='flex max-w-max flex-col font-sans text-base'>
				<h1 className='font-[450] text-gray-950 dark:text-gray-50'>John Eatmon</h1>
				<span>Software Engineer</span>
				<span>Seattle, Washington</span>
			</small>
		</header>
	);
};

export default Header;
