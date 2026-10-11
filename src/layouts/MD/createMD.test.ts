import { readFile } from 'node:fs/promises'

import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vite-plus/test'

import { createMD, mdToHtml, mdToText } from './createMD'

describe('createMD sections', () => {
	function Section({
		children,
		index,
	}: {
		children?: ReactNode
		index: number
	}) {
		expect(typeof index).toBe('number')
		return createElement('section', { 'data-index': index }, children)
	}

	test('wraps content before the first H2 in its own section', async () => {
		const MD = createMD(
			{
				h2: ({ children }) =>
					createElement('h2', { className: 'heading' }, children),
			},
			Section,
		)
		const html = renderToStaticMarkup(
			await MD({
				children:
					'# Title\n\nIntro\n\n## First\n\nBody\n\n### Detail\n\n- item\n\n## Second\n\n## Third\n\nEnd',
			}),
		)
		expect(html.replaceAll('\n', '')).toBe(
			'<section data-index="0"><h1>Title</h1><p>Intro</p></section><section data-index="1"><h2 class="heading">First</h2><p>Body</p><h3>Detail</h3><ul data-depth="0"><li>item</li></ul></section><section data-index="2"><h2 class="heading">Second</h2></section><section data-index="3"><h2 class="heading">Third</h2><p>End</p></section>',
		)
	})

	test('wraps markdown without a top-level H2 in the first section', async () => {
		const MD = createMD({}, Section)
		const html = renderToStaticMarkup(
			await MD({ children: 'Intro\n\n> ## Quoted' }),
		)
		expect(html.replaceAll('\n', '')).toBe(
			'<section data-index="0"><p>Intro</p><blockquote><h2>Quoted</h2></blockquote></section>',
		)
	})

	test.each([
		[
			'## First\n\nBody',
			'<section data-index="0"><h2>First</h2><p>Body</p></section>',
		],
		[
			'## First\n\n## Second',
			'<section data-index="0"><h2>First</h2></section><section data-index="1"><h2>Second</h2></section>',
		],
	])('groups documents starting with an H2: %s', async (children, expected) => {
		const MD = createMD({}, Section)
		expect(
			renderToStaticMarkup(await MD({ children })).replaceAll('\n', ''),
		).toBe(expected)
	})

	test('preserves existing rendering when Section is omitted', async () => {
		const MD = createMD({})
		const html = renderToStaticMarkup(
			await MD({ children: '## First\n\nBody\n\n## Second' }),
		)
		expect(html.replaceAll('\n', '')).toBe(
			'<h2>First</h2><p>Body</p><h2>Second</h2>',
		)
	})
})

describe('mdToText', async () => {
	test('converts markdown to plain text', async () => {
		expect(await mdToText('# Hello **world**\n\n- one\n- two')).toBe(
			'Hello world\n\none\ntwo\n',
		)
	})
})

describe('mdToHtml', () => {
	test('renders the hello-world post for concurrent requests', async () => {
		const post = await readFile('content/blog/hello-world.md', 'utf8')
		const results = await Promise.all(
			Array.from({ length: 3 }, () => mdToHtml(post)),
		)
		for (const html of results) {
			expect(html).toContain('<picture>')
			expect(html).toContain('data:image/svg+xml,')
			expect(html).toContain('This is the content of the post.')
		}
	}, 30_000)

	test('wires dual-theme token variables to visible syntax colors', async () => {
		const [html, css] = await Promise.all([
			mdToHtml('```js\nconst x = 3\n```'),
			readFile('src/pages/syntax-highlighting.css', 'utf8'),
		])

		expect(html).toContain('<span')
		expect(html).toMatch(/<span[^>]*style="[^"]*--shiki-light:/)
		expect(html).toMatch(/<span[^>]*style="[^"]*--shiki-dark:/)
		expect(css).toMatch(/code\[data-theme\*=['"] ['"]\] span/)
		expect(css).toContain('color: var(--shiki-light)')
		expect(css).toContain('color: var(--shiki-dark)')
	})

	test('renders mermaid diagrams on the server using the site font', async () => {
		const html = await mdToHtml(
			'a test paragraph\n\n```mermaid\nflowchart TD\n  Start([Start]) --> Timer[Start the timer]\n  Timer --> Decide{Need a break?}\n  Decide -- Yes --> Pause[Pause]\n  Decide -- No --> Done[Done]\n```',
		)

		// `img-svg` embeds the diagram as `<img src="data:image/svg+xml,...">`, so the
		// SVG payload is URL-encoded inside the data URI rather than inlined.
		expect(html).toContain('<picture>')
		expect(html).toMatch(
			/<source[^>]*media="\(prefers-color-scheme: dark\)"[^>]*srcset="data:image\/svg\+xml,/,
		)
		expect(html).toContain('<img')
		expect(html).toMatch(/src="data:image\/svg\+xml,/)
		// Labels must be rendered as native SVG `<text>`/`<tspan>` (htmlLabels:false),
		// never as HTML inside `<foreignObject>` — which is invisible under `<img>`.
		expect(html).not.toContain('foreignObject')
		const encodedSvg = html.match(/src="data:image\/svg\+xml,([^"]+)"/)?.[1]
		expect(encodedSvg).toBeDefined()
		const svg = decodeURIComponent(encodedSvg!.replaceAll('&#x27;', "'"))
		// Mermaid's flowchart path omits `xml:space` on its word-tspans, so the
		// SVG root must preserve their leading word-separator whitespace.
		expect(svg).toContain("xml:space='preserve'")
		expect(svg).toContain('font-family:Nunito')
		// SVGs loaded through `<img>` cannot use the document's @font-face rules.
		// Embed the font fetched from the site's shared webfont source into the SVG.
		expect(svg).toContain('@font-face')
		expect(svg).toContain('data:font/woff2;base64,')
		expect(svg).not.toContain('font-family:arial,sans-serif')
		const encodedThemeSvgs = [
			...html.matchAll(/(?:src|srcset)="data:image\/svg\+xml,([^"]+)"/g),
		]
		expect(encodedThemeSvgs).toHaveLength(2)
		for (const [, encodedThemeSvg] of encodedThemeSvgs) {
			const themeSvg = decodeURIComponent(
				encodedThemeSvg!.replaceAll('&#x27;', "'"),
			)
			expect(themeSvg).toContain('@font-face')
			expect(themeSvg).toContain('data:font/woff2;base64,')
		}
		expect(html).not.toContain('<pre><code')
	})
})
