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

describe('list depth regression', () => {
	test('nested ul/ol carry data-depth through the full real pipeline', async () => {
		const html = await mdToHtml(
			'- top\n  - nested\n    - deep\n1. a\n   1. b\n      1. c\n',
		)
		expect(html).toContain('<ul data-depth="0"')
		expect(html).toContain('<ul data-depth="1"')
		expect(html).toContain('<ul data-depth="2"')
		expect(html).toContain('<ol data-depth="0"')
		expect(html).toContain('<ol data-depth="1"')
		expect(html).toContain('<ol data-depth="2"')
	})
})
