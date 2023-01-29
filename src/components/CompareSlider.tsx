import {
	ReactCompareSlider,
	ReactCompareSliderImage,
	styleFitContainer,
} from "react-compare-slider"

type Props = {
	imageA: {
		src: string
		alt?: string
	}
	imageB: {
		src: string
		alt?: string
	}
}

const CompareSlider = (props: Props) => {
	return (
		<ReactCompareSlider
			style={{
				width: "100%",
				aspectRatio: "4/3",
				maxHeight: "fit-content",
				borderRadius: "8px",
			}}
			itemOne={
				<ReactCompareSliderImage
					src={props.imageA.src}
					alt={props.imageA.alt ?? ""}
					style={{
						...styleFitContainer({
							objectFit: "cover",
							objectPosition: "top",
						}),
					}}
				/>
			}
			itemTwo={
				<ReactCompareSliderImage
					src={props.imageB.src}
					alt={props.imageB.alt ?? ""}
					style={{
						...styleFitContainer({
							objectFit: "cover",
							objectPosition: "top",
						}),
					}}
				/>
			}
		/>
	)
}

export default CompareSlider
