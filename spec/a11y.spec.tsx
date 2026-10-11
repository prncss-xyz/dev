import { expect, test } from '@/fixtures/a11y'

import { buildBasePath } from '../src/basePath'

// Path-absolute route prefix under the waku basePath. `buildBasePath`
// already appends a trailing '/', so subroutes are joined without a
// leading slash to avoid double-slashes.
const root = buildBasePath(process.env)

function normalizePageUrl(href: string, rootPath: string) {
	const url = new URL(href)
	const pathname =
		url.pathname !== rootPath && url.pathname.endsWith('/')
			? url.pathname.slice(0, -1)
			: url.pathname

	return `${url.origin}${pathname}${url.search}`
}

function isInternalPageUrl(href: string, origin: string, rootPath: string) {
	try {
		const url = new URL(href)
		return (
			(url.protocol === 'http:' || url.protocol === 'https:') &&
			url.origin === origin &&
			url.pathname.startsWith(rootPath)
		)
	} catch {
		return false
	}
}

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`accessibility (axe, ${colorScheme})`, () => {
		test.use({ colorScheme })
		test('crawled pages have no WCAG violations', async ({
			page,
			analyzeAxe,
		}) => {
			const blockList = ['rss.xml']
			await page.goto(root)

			const startUrl = new URL(page.url())
			const origin = startUrl.origin
			const rootPath = startUrl.pathname
			const visited = new Set<string>()
			const queue = [startUrl.href]

			while (queue.length > 0) {
				const url = queue.shift()!
				const key = normalizePageUrl(url, rootPath)
				const pathname = new URL(key).pathname
				const routePath = pathname.startsWith(rootPath)
					? pathname.slice(rootPath.length)
					: pathname

				if (blockList.includes(routePath)) continue
				if (visited.has(key)) continue
				visited.add(key)
				// oxlint-disable-next-line no-console
				console.log('visiting', pathname)

				await page.goto(url)
				const { violations, passes, incomplete } = await analyzeAxe()
				expect
					.soft(
						incomplete
							.filter((result) => result.id === 'color-contrast')
							.flatMap((result) =>
								result.nodes.map((node) => ({
									target: node.target,
									reason: node.failureSummary,
								})),
							),
						`Color contrast could not be determined on ${pathname} in ${colorScheme} mode`,
					)
					.toEqual([])
				expect
					.soft(
						passes,
						`Color contrast was not verified on ${pathname} in ${colorScheme} mode`,
					)
					.toEqual(
						expect.arrayContaining([
							expect.objectContaining({ id: 'color-contrast' }),
						]),
					)
				expect
					.soft(
						violations,
						`Accessibility violations found on ${pathname} in ${colorScheme} mode`,
					)
					.toEqual([])

				const discovered = await page.evaluate(() =>
					Array.from(
						document.querySelectorAll<HTMLAnchorElement>('a[href], area[href]'),
					)
						.map((element) => element.href)
						.filter((href) => href !== ''),
				)

				for (const href of discovered) {
					if (!isInternalPageUrl(href, origin, rootPath)) continue

					const normalized = normalizePageUrl(href, rootPath)
					if (!visited.has(normalized)) {
						queue.push(href)
					}
				}
			}
		})
	})
}
