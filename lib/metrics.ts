import { unstable_cache as cache } from 'next/cache';
import 'server-only';
import db from '~/lib/planetscale';
import { parseError } from '~/lib/utils';

export const getBlogViews = cache(
	async () => {
		if (
			!process.env.DATABASE_HOST ||
			!process.env.DATABASE_USERNAME ||
			!process.env.DATABASE_PASSWORD
		) {
			return 0;
		}

		const data = await db.selectFrom('views').select(['count']).execute();

		return data.reduce((acc, curr) => acc + Number(curr.count), 0);
	},
	['blog-views-total'],
	{
		revalidate: 5,
	}
);

export const getViewsCount = cache(
	async () => {
		return db.selectFrom('views').select(['slug', 'count']).execute();
	},
	['all-views'],
	{
		revalidate: 5,
	}
);

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

type YNABError = {
	error: {
		id: string;
		name: string;
		detail: string;
	};
};

type YNABAccounts = {
	data: {
		accounts: Array<{
			type: string;
			balance: number;
			deleted: boolean;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			[key: string]: any;
		}>;
	};
	server_knowledge: number;
};

export const getYNABDebt = cache(
	async () => {
		try {
			const response = await fetch(
				`https://api.ynab.com/v1/budgets/${process.env.YNAB_BUDGET_ID}/accounts`,
				{
					headers: { Authorization: `Bearer ${process.env.YNAB_PERSONAL_ACCESS_TOKEN}` },
				}
			);

			if (!response.ok) {
				const { error } = (await response.json()) as YNABError;
				throw new Error(error.detail);
			}

			const { data } = (await response.json()) as YNABAccounts;
			const accounts = data.accounts
				.filter((account) => !account.deleted)
				.filter((account) =>
					['medicalDebt', 'otherDebt', 'studentLoan', 'personalLoan', 'autoLoan'].includes(
						account.type
					)
				);
			return accounts.reduce((acc, account) => acc + Number(account.balance / 1_000), 0);
		} catch (error: unknown) {
			const message = parseError(error);
			throw new Error(message);
		}
	},
	['ynab-balance'],
	{ revalidate: 60 * 60 * 60 * 24 * 7 } // Every week
);
