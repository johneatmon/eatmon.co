import { unstable_cache as cache } from 'next/cache';
import 'server-only';
import { parseError } from '~/lib/utils';

const LITERAL_API_ENDPOINT = 'https://literal.club/graphql/';

const email = process.env.LITERAL_EMAIL_ADDRESS;
const password = process.env.LITERAL_PASSWORD;

const LOGIN_MUTATION = JSON.stringify({
	query: `mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			email
			languages
			profile {
				id
				handle
				name
				bio
				image
			}
		}
	}`,
	variables: { email, password },
});

const GET_BOOKS_BY_READING_STATE_AND_PROFILE = `
	query booksByReadingStateAndProfile(
		$limit: Int!
		$offset: Int!
		$readingStatus: ReadingStatus!
		$profileId: String!
	) {
		booksByReadingStateAndProfile(
			limit: $limit
			offset: $offset
			readingStatus: $readingStatus
			profileId: $profileId
		) {
			id
			slug
			title
			subtitle
			description
			isbn10
			isbn13
			language
			pageCount
			publishedDate
			publisher
			cover
			authors {
				id
				name
			}
			gradientColors
		}
	}
`;

type Book = {
	[key: string]: unknown;
	id: string;
	slug: string;
	title: string;
	subtitle: string;
	description?: string;
	isbn10?: string;
	isbn13?: string;
	language: string;
	pageCount: number;
	publishedDate?: string | Date;
	publisher?: string;
	cover: string;
	authors: {
		id: string;
		name: string;
	}[];
	gradientColors: string[] | unknown;
};

/**
 * @description This is the response from the login mutation.
 * @link https://literal.club/pages/api
 */
type LiteralAuthResponse = {
	data: {
		login: {
			token: string;
			email: string;
			languages: string[];
			profile: {
				id: string;
				handle: string;
				name: string;
				bio: string;
				image: string;
			};
		};
	};
};

/**
 * @description This is the response from the book fetch query.
 * @link https://literal.club/pages/api
 */
export type LiteralBookResponse = {
	data: { booksByReadingStateAndProfile: Book[] };
};

const fetchLiteralToken = cache(
	async () => {
		try {
			if (!email || !password) {
				throw new Error('Forgot to add Literal credentials to .env');
			}

			const response = await fetch(LITERAL_API_ENDPOINT, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: LOGIN_MUTATION,
				cache: 'no-cache',
			});

			if (!response.ok) {
				throw new Error(response.statusText ?? response.status ?? "Couldn't fetch Literal token");
			}

			const { data } = (await response.json()) as LiteralAuthResponse;
			const { token } = data.login;
			const { id } = data.login.profile;

			return { token, id };
		} catch (error: unknown) {
			const message = parseError(error);
			throw new Error(message);
		}
	},
	['literal-token'],
	{ revalidate: 60 * 60 * 24 * 7 * 24 } // ~6 months
);

export const fetchBooks = cache(
	async (count?: number) => {
		try {
			const { token, id } = await fetchLiteralToken();

			const response = await fetch('https://literal.club/graphql/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					query: GET_BOOKS_BY_READING_STATE_AND_PROFILE,
					variables: {
						limit: count ?? 10,
						offset: 0,
						readingStatus: 'FINISHED',
						profileId: id,
					},
				}),
			});

			if (!response.ok) {
				throw new Error(
					response.statusText ?? response.status ?? "Couldn't fetch data from Literal"
				);
			}

			const { data } = (await response.json()) as LiteralBookResponse;
			const books = data.booksByReadingStateAndProfile;

			return books;
		} catch (error: unknown) {
			const message = parseError(error);
			throw new Error(message);
		}
	},
	['literal-books'],
	{ revalidate: 60 * 60 * 24 * 7 * 4 } // ~1 months
);
