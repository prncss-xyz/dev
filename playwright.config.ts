import { execSync } from 'node:child_process'

import { defineConfig, devices } from '@playwright/test'

import { buildBasePath } from './src/basePath'

// Playwright runs in Node, not Vite, so it reads VITE_BASE_PATH from
// process.env (set by the workflow) and reuses the same formula as
// src/meta.ts via buildBasePath. Tests poll and navigate relative to
// this prefix so e2e runs against the same basePath-baked build that
// ships to GitHub Pages.
const host = 'http://localhost:8080'
const root = host + buildBasePath(process.env)
const chromiumPath = (() => {
	try {
		return execSync('which chromium', { encoding: 'utf8' }).trim()
	} catch {
		return undefined
	}
})()

export default defineConfig({
	testDir: './spec',
	testMatch: '**/*.spec.tsx',
	snapshotDir: './__snapshots__',
	outputDir: 'test-results',
	timeout: 30 * 1000,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	// Limit concurrent browser launches on local machines.
	workers: process.env.CI ? 1 : 2,
	reporter: [
		['html'],
		['json', { outputFile: 'playwright-report/results.json' }],
	],
	use: {
		baseURL: root,
		headless: true,
		trace: 'on-first-retry',
	},
	webServer: {
		command: './node_modules/.bin/waku start',
		url: root,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI,
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				// Use a system browser when available; otherwise fall back to Playwright's bundled one.
				...(chromiumPath && {
					launchOptions: { executablePath: chromiumPath },
				}),
			},
		},
	],
})
