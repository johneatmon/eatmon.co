'use client';

import 'blaze-slider/dist/blaze.css';
import { ReactNode } from 'react';
import { useBlazeSlider } from 'react-blaze-slider';

const Slider = ({ children }: { children: ReactNode }) => {
	const elRef = useBlazeSlider({
		all: {
			slidesToShow: 3,
			slideGap: '16px',
			enablePagination: true,
		},
	});

	return (
		<div className='blaze-slider' ref={elRef}>
			<div className='blaze-container'>
				<div className='blaze-track-container'>
					<div className='blaze-track'>{children}</div>
				</div>
			</div>
		</div>
	);
};

export default Slider;
