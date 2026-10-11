import { fileURLToPath } from 'node:url'

import contentCollections from '@content-collections/vite'
import stylex from '@stylexjs/unplugin'
import react from '@vitejs/plugin-react'
import { ViteWebfontDownload } from 'vite-plugin-webfont-dl'
import { defineConfig } from 'vite-plus'

import { viteWebfontDownloadConfig } from './fontConstants'
import fmt from './oxfmt.config'
import lint from './oxlint.config'
import { buildBasePath } from './src/basePath'
import {
	stylexLightningCssOptions,
	stylexRootCssInjectionTarget,
} from './stylex.config'
import injectWebfontToCss from './vite-plugins/inject-webfont-to-css'

export default defineConfig({
	build: {
		rollupOptions: {
			external: (id) =>
				[
					'virtual:stylex:css-only',
					'rehype-mermaid',
					'mermaid-isomorphic',
					'playwright-core',
				].some((pkg) => id === pkg || id.startsWith(`${pkg}/`)),
		},
	},
	fmt,
	lint,
	plugins: [
		// the StyleX Vite plugin (@stylexjs/unplugin), keeps file watchers and cause the Vite dev server to keep alive when tests have completed
		process.env.VITEST
			? null
			: stylex.vite({
					env: {
						basePath: buildBasePath(process.env),
					},
					aliases: {
						'@/*': [fileURLToPath(new URL('./src/*', import.meta.url))],
					},
					devMode: 'css-only',
					devPersistToDisk: true,
					lightningcssOptions: stylexLightningCssOptions,
					cssInjectionTarget: stylexRootCssInjectionTarget,
					runtimeInjection: false,
					useCSSLayers: true,
				}),
		react({ compiler: true }),
		contentCollections({
			isEnabled: () => !process.env.VITEST,
		}),
		ViteWebfontDownload(viteWebfontDownloadConfig),
		injectWebfontToCss,
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	run: {
		tasks: {
			check: {
				command: 'vp check',
				dependsOn: ['build'],
			},
			staged: {
				command: 'vp staged',
			},
			commitlint: {
				command: 'commitlint --edit',
			},
			start: {
				command: 'waku start',
				dependsOn: ['build'],
			},
			build: {
				command: 'waku build',
				cache: {
					output: ['dist/**'],
					input: [
						'tsconfig.json',
						'vite.config.ts',
						'vite-plugins/**/*.{ts,tsx}',
						'package.json',
						'pnpm-workspace.yaml',
						'content/**',
						'**/src/**/*.{js,ts,jsx,tsx}',
					],
					env: ['VITE_GITHUB_REPOSITORY', 'VITE_BASE_URL', 'VITE_BASE_PATH'],
				},
			},
			tsc: {
				cache: {
					input: [
						'tsconfig.json',
						'vite.config.ts',
						'vite-plugins/**/*.{ts,tsx}',
						'package.json',
						'pnpm-workspace.yaml',
						'content/**',
						'**/src/**/*.{js,ts,jsx,tsx}',
					],
				},
				command: 'tsc --noEmit',
				dependsOn: ['build'],
			},
			'tsc:changed': {
				cache: {
					input: [
						'tsconfig.json',
						'vite.config.ts',
						'vite-plugins/**/*.{ts,tsx}',
						'package.json',
						'pnpm-workspace.yaml',
						'content/**',
						'**/src/**/*.{js,ts,jsx,tsx}',
					],
				},
				command: 'tsc --noEmit',
			},
			'test:e2e': {
				cache: {
					input: [
						'tsconfig.json',
						'vite.config.ts',
						'vite-plugins/**/*.{ts,tsx}',
						'package.json',
						'pnpm-workspace.yaml',
						'content/**',
						'**/src/**/*.{js,ts,jsx,tsx}',
						'playwright.config.ts',
						'spec/**/*.spec.tsx',
					],
					env: ['VITE_GITHUB_REPOSITORY', 'VITE_BASE_URL', 'VITE_BASE_PATH'],
				},
				command: 'playwright test',
				dependsOn: ['build'],
			},
			'test:e2e:changed': {
				command: 'playwright test --only-changed',
			},
			'test:units': {
				cache: {
					input: [
						'tsconfig.json',
						'vite.config.ts',
						'vite-plugins/**/*.{ts,tsx}',
						'package.json',
						'pnpm-workspace.yaml',
						'content/**',
						'**/src/**/*.{js,ts,jsx,tsx}',
					],
				},
				command: 'vp test',
			},
			'test:units:changed': {
				command: 'vp test --changed',
			},
			ci: {
				// Cancelling parallel tasks can orphan Playwright's web server and
				// keep the runner's output pipes open after a test failure.
				cache: false,
				command: [
					'vp run test:units',
					'vp run check:knip',
					'vp run build',
					'vp run check',
					'vp run tsc',
					'vp run test:e2e',
				],
			},
			pre_commit: {
				cache: false,
				command: [
					'vp run test:units:changed',
					'vp run check:knip',
					'vp run build',
					'vp run tsc:changed',
					'vp run test:e2e:changed',
				],
			},
		},
	},
	staged: {
		'*': 'vp check --fix',
	},
	test: {
		coverage: {
			exclude: ['**/src/**/*.test.{js,ts,jsx,tsx}', '**/src/test.setup.ts'],
			provider: 'v8',
			reporter: ['text', 'json'],
		},
		globals: true,
		include: ['**/src/**/*.test.{js,ts,jsx,tsx}'],
		passWithNoTests: true,
		pool: 'forks',
	},
})
