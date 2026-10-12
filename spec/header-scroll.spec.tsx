import { expect, test } from '@playwright/test'

import { buildBasePath } from '../src/basePath'

for (const width of [1280, 390]) {
	test(`navbar follows scroll direction at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 400 })
		await page.goto(buildBasePath(process.env))
		await page.waitForLoadState('networkidle')
		const header = page.locator('header')
		const initial = await header.boundingBox()
		expect(initial).not.toBeNull()
		const height = initial!.height
		const top = initial!.y
		const half = Math.round(height / 2)
		const third = Math.round(height / 3)
		const sixth = Math.round(height / 6)
		function position() {
			return header.evaluate((element) => element.getBoundingClientRect().top)
		}
		async function scroll(y: number) {
			await page.evaluate((value) => window.scrollTo(0, value), y)
			await expect
				.poll(() => page.evaluate(() => window.scrollY))
				.toBeCloseTo(y, 0)
		}
		async function expectTop(y: number) {
			await expect.poll(position).toBeCloseTo(y, 0)
		}

		await scroll(top + half)
		await expectTop(-half)
		const deep = top + height + 150
		await scroll(deep)
		await expectTop(-height)
		await scroll(deep - third)
		await expectTop(-height + third)
		// Reversing before fully revealed should hide by the same distance.
		await scroll(deep - third + sixth)
		await expectTop(-height + third - sixth)
		const revealed = deep - third + sixth - Math.ceil(height)
		await scroll(revealed)
		await expectTop(0)
		await scroll(revealed - 30)
		await expectTop(0)
		await scroll(revealed - 30 + half)
		await expectTop(-half)
		await scroll(0)
		await expectTop(top)
		expect((await header.boundingBox())!.height).toBe(height)
	})
}
