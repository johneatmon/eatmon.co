import { SVGProps } from 'react';

export default function UHCIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width='32'
			height='32'
			viewBox='0 0 32 32'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<rect width='32' height='32' fill='white' />
			<g clipPath='url(#clip)'>
				<path
					d='M13.1246 24.5994C13.7577 24.8136 14.4219 24.9215 15.0903 24.9186C18.0464 24.9186 20.1156 22.7725 20.1156 18.7109V6.55263L21.233 6.01758V18.9149C21.233 23.0711 19.0899 25.4921 16.0511 25.4921C15.0095 25.4857 13.9924 25.1755 13.1246 24.5994ZM11.8416 23.3637C12.4735 23.5895 13.1367 23.7152 13.8074 23.7362C16.2935 23.7362 17.9459 22.1754 17.9459 18.6518V7.47787L19.0515 6.95761V18.7523C19.0544 22.4385 17.1862 24.3274 14.5878 24.3274C13.5933 24.3061 12.6314 23.9685 11.8416 23.3637ZM11.0642 22.2582C11.5946 22.4328 12.1468 22.5323 12.7048 22.5538C14.6351 22.5538 15.8205 21.4955 15.8205 18.7109V8.42086L16.9113 7.90059V18.5572C16.9113 21.6758 15.4805 23.0888 13.4349 23.0888C12.5743 23.0835 11.74 22.7912 11.0642 22.2582ZM14.7977 19.0065V8.84357L10 11.0045V19.2548C10 20.8304 10.9932 21.8857 12.4535 21.8857C13.9138 21.8857 14.7977 20.8156 14.7977 19.0065Z'
					fill='#002677'
				/>
			</g>
			<defs>
				<clipPath id='clip'>
					<rect width='11.233' height='19.51' fill='white' transform='translate(10 6)' />
				</clipPath>
			</defs>
		</svg>
	);
}