import { expect, test } from '@playwright/test'

import { noop } from '@/utils/messages/utils'

import { buildBasePath } from '../src/basePath'

test('navigation highlights the destination before its page loads', async ({
	page,
}) => {
	const root = buildBasePath(process.env)
	await page.goto(root)
	await page.waitForLoadState('networkidle')
	const content = page.locator('main > div > div:not([inert])')
	await expect(content).toHaveCSS('mix-blend-mode', 'normal')
	let release: () => void = noop
	const responseGate = new Promise<void>((resolve) => {
		release = resolve
	})
	await page.route('**/RSC/**', async (route) => {
		await responseGate
		await route.continue()
	})
	const blog = page.getByRole('link', { name: 'blog', exact: true })
	await page.evaluate(() => {
		const end = performance.now() + 5000
		function observeFade() {
			const fades = document.getAnimations().flatMap((animation) => {
				const effect = animation.effect as KeyframeEffect | null
				if (
					!effect?.target ||
					!document.querySelector('main')?.contains(effect.target)
				)
					return []
				const opacity = effect.getKeyframes().map((frame) => frame.opacity)
				if (opacity.some((value) => value === undefined)) return []
				return [
					{
						opacity,
						duration: effect.getTiming().duration,
						heading: effect.target.querySelector('h1')?.textContent,
						blendMode: getComputedStyle(effect.target).mixBlendMode,
					},
				]
			})
			if (fades.length >= 2) {
				document.documentElement.dataset.pageFades = JSON.stringify(fades)
				return
			}
			if (performance.now() < end) requestAnimationFrame(observeFade)
		}
		observeFade()
	})
	await blog.click()
	try {
		await expect(blog).toHaveAttribute('aria-current', 'page')
		await expect(
			page.getByRole('heading', { name: 'About Me', exact: true }),
		).toBeVisible()
	} finally {
		release()
	}
	await expect(page).toHaveURL(new RegExp(`${root}blog$`))
	await expect(
		page.getByRole('heading', { name: 'Blog', exact: true }),
	).toBeVisible()
	await expect(page.locator('html')).toHaveAttribute(
		'data-page-fades',
		/opacity/,
	)
	const fades = JSON.parse(
		(await page.locator('html').getAttribute('data-page-fades')) || '[]',
	)
	expect(fades).toEqual(
		expect.arrayContaining([
			{
				opacity: ['1', '0'],
				duration: expect.any(Number),
				heading: 'About Me',
				blendMode: 'plus-lighter',
			},
			{
				opacity: ['0', '1'],
				duration: expect.any(Number),
				heading: 'Blog',
				blendMode: 'plus-lighter',
			},
		]),
	)
	const [duration] = fades.map((fade: { duration: number }) => fade.duration)
	expect(duration).toBeGreaterThan(0)
	for (const fade of fades) expect(fade.duration).toBe(duration)
	await expect(
		page.getByRole('heading', { name: 'About Me', exact: true }),
	).not.toBeVisible()
	await expect(content).toHaveCSS('mix-blend-mode', 'normal')
	await page.emulateMedia({ reducedMotion: 'reduce' })
	const reducedDuration = await page.evaluate(
		() =>
			getComputedStyle(document.querySelector('main > div > div')!)
				.animationDuration,
	)
	expect(reducedDuration).toBe('0s')
	await page.goBack()
	await expect(
		page.getByRole('link', { name: 'about', exact: true }),
	).toHaveAttribute('aria-current', 'page')
	await expect(page).toHaveURL(new RegExp(`${root}$`))
	await expect(
		page.getByRole('heading', { name: 'About Me', exact: true }),
	).toBeVisible()
	await expect(
		page.getByRole('heading', { name: 'Blog', exact: true }),
	).not.toBeVisible()
	await expect(content).toHaveCSS('mix-blend-mode', 'normal')
})
