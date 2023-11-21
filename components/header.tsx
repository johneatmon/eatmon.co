import { Suspense } from 'react';
import BlurImage from '~/components/image';
import { getSeattleWeather } from '~/lib/metrics';

const Header = () => {
	return (
		<header>
			<BlurImage
				src='https://eatmon.co/cdn-cgi/imagedelivery/le40TwFDWUdIvXckEp8FBw/me_and_adams.png/square'
				className='mb-4 aspect-square w-10 rounded-full'
				alt='A selfie of me on Mt Rainier, with Mt Adams in the background'
				width={40}
				height={40}
				loading='eager'
			/>
			<h1>
				<small className='flex max-w-max flex-col text-sm leading-relaxed text-gray-500'>
					<span className='font-medium text-gray-100'>John Eatmon</span>
					<span>Software Engineer at UnitedHealthcare</span>
					<span>
						Seattle, WA &middot;{' '}
						<Suspense fallback={<span>Loading weather...</span>}>
							<SeattleWeather />
						</Suspense>
					</span>
					{/* Software Engineer&ensp;&#9585;&ensp;Seattle, WA */}
				</small>
			</h1>
		</header>
	);
};

export default Header;

async function SeattleWeather() {
	let weather;

	try {
		weather = await getSeattleWeather();
	} catch (error) {
		console.error(error);
	}

	if (!weather) {
		return null;
	}

	const { temperature, temperatureUnit, shortForecast } = weather;

	return (
		<span
			dangerouslySetInnerHTML={{
				__html: ` ${temperature}&deg;${temperatureUnit}, ${shortForecast.toLocaleLowerCase()}`,
			}}
		/>
	);
}
