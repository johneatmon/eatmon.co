import { unstable_cache as cache } from 'next/cache';
import 'server-only';

type ForecastPeriod = {
	number: number;
	name: string;
	startTime: Date;
	endTime: Date;
	isDaytime: boolean;
	temperature: number;
	temperatureUnit: string;
	temperatureTrend: string;
	probabilityOfPrecipitation: {
		unitCode: string;
		value: number;
		maxValue?: number;
		minValue?: number;
		qualityControl?: string;
	};
	dewpoint: {
		unitCode: string;
		value: number;
		maxValue?: number;
		minValue?: number;
		qualityControl?: string;
	};
	relativeHumidity: {
		unitCode: string;
		value: number;
		maxValue?: number;
		minValue?: number;
		qualityControl?: string;
	};
	windSpeed: string;
	windDirection: string;
	icon: string;
	shortForecast: string;
	detailedForecast: string;
};

type Forecast = {
	id?: string;
	'@context'?: unknown;
	type: string;
	geometry: {
		type: string;
		coordinates: number[][];
	};
	properties: {
		updated: Date;
		units: 'us';
		forecastGenerator: string;
		generatedAt: Date;
		updatedTime: Date;
		validTimes?: string;
		elevation: {
			value: number;
			maxValue?: number;
			minValue?: number;
			unitCode: string;
			qualityControl?: string;
		};
		periods: Array<ForecastPeriod>;
	};
};

/**
 * @description Get the current weather in Seattle, WA
 * @link https://www.weather.gov/documentation/services-web-api#/default/gridpoint_forecast
 */
export const getSeattleWeather = cache(
	async () => {
		const res = await fetch('https://api.weather.gov/gridpoints/SEW/124,69/forecast');
		const data = (await res.json()) as Forecast;
		const currentTime = new Date();

		const hourlyForecast = data.properties.periods.filter((x) => {
			return new Date(x.startTime) < currentTime && new Date(x.endTime) > currentTime;
		});

		return hourlyForecast.shift() as ForecastPeriod;
	},
	['seattle-weather'],
	{ revalidate: 60 * 60 * 60 } // Every hour
);
