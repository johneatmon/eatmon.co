import BlurImage from '~/components/image';

const Header = () => {
	return (
		<header>
			<BlurImage
				src='https://eatmon.co/cdn-cgi/imagedelivery/le40TwFDWUdIvXckEp8FBw/ebab5e6e-2096-4954-3a37-b83bbea1b300/square'
				className='mb-4 aspect-square w-10 rounded-full transition-all dark:grayscale'
				alt='A selfie of me on Mt Rainier, with Mt Adams in the background'
				width={40}
				height={40}
				loading='eager'
			/>
			<small className='flex max-w-max flex-col font-sans text-base'>
				<h1 className='font-medium text-gray-950 dark:text-gray-50'>John Eatmon</h1>
				<span>Software Engineer</span>
				<span>Seattle, Washington</span>
			</small>
		</header>
	);
};

export default Header;
