import puppeteer from 'puppeteer';
import 'server-only';

export async function getHikes() {
	const browser = await puppeteer.launch({
		headless: 'new',
	});

	try {
		const page = await browser.newPage();
		await page.setUserAgent(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
		);
		await page.goto(
			'https://www.wta.org/go-hiking/trip-reports/tripreport_search?creator=f8dc7b3d207f48ada01438794c69a1ff'
		);
		await page.waitForSelector('.item');
		const hikes = await page.evaluate(() => {
			const items = document.querySelectorAll('.item');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const hikeData = [] as any[];

			items.forEach((item) => {
				const text = item.querySelector('h3 > a')?.innerHTML?.trim()?.split('—');
				const trail = text?.[0]?.trim();
				const date = text?.[1]?.trim();
				const url = item.querySelector('a')?.getAttribute('href') ?? '#';

				hikeData.push({ trail, date, url });
			});

			return hikeData;
		});

		return hikes;
	} catch (error) {
		console.error(error);
	} finally {
		await browser.close();
	}
}
