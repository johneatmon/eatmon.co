import { unstable_cache as cache } from 'next/cache';
import 'server-only';
import { parseError } from '~/lib/utils';

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
