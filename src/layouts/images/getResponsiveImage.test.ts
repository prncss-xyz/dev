import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import sharp from 'sharp'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { basePath } from '@/meta'

import { getResponsiveImage } from './getResponsiveImage'

const remoteUrl = 'https://example.com/cat.png'

let cacheRoot = ''
let emittedDir = ''
let testRoot = ''

async function readFiles(directory: string) {
	try {
		return await readdir(directory)
	} catch {
		return []
	}
}

function createPng(background: string) {
	return sharp({
		create: {
			background,
			channels: 3,
			height: 30,
			width: 40,
		},
	})
		.png()
		.toBuffer()
}

function mockImageFetch(buffer: Buffer) {
	return vi.fn(
		async () =>
			new Response(Uint8Array.from(buffer).buffer, {
				headers: {
					'content-type': 'image/png',
				},
			}),
	)
}

describe('getResponsiveImage', () => {
	beforeEach(async () => {
		testRoot = await mkdtemp(join(tmpdir(), 'responsive-images-test-'))
		cacheRoot = join(testRoot, 'cache')
		emittedDir = join(testRoot, 'gen')
		vi.stubEnv('RESPONSIVE_IMAGE_CACHE_ROOT', cacheRoot)
		vi.stubEnv('RESPONSIVE_IMAGE_OUTPUT_DIR', emittedDir)
	})

	afterEach(async () => {
		vi.unstubAllGlobals()
		vi.unstubAllEnvs()
		await rm(testRoot, { force: true, recursive: true })
	})

	it('caches fetched originals and generated variants before emitting files', async () => {
		const buffer = await createPng('#ff0000')
		const fetchMock = mockImageFetch(buffer)
		vi.stubGlobal('fetch', fetchMock)

		const image = await getResponsiveImage(remoteUrl, 'cat')

		expect(fetchMock).toHaveBeenCalledTimes(1)
		expect(image.alt).toBe('cat')
		expect(image.width).toBe(40)
		expect(image.height).toBe(30)
		expect(image.src.startsWith(basePath)).toBe(true)
		expect(image.src.slice(basePath.length)).toMatch(
			/^gen\/[a-f0-9]{12}\.webp$/,
		)
		expect(image.srcSet.split(', ')).toHaveLength(8)
		expect(image.placeholder).toMatch(/^data:image\/svg\+xml;base64,/)
		expect(await readFiles(join(cacheRoot, 'originals'))).toHaveLength(1)
		expect(await readFiles(join(cacheRoot, 'variants'))).toHaveLength(8)
		expect(await readFiles(emittedDir)).toHaveLength(8)
	})

	it('falls back to the cached original when fetching fails later', async () => {
		const buffer = await createPng('#00ff00')
		vi.stubGlobal('fetch', mockImageFetch(buffer))
		const firstImage = await getResponsiveImage(remoteUrl, 'cat')

		vi.stubGlobal(
			'fetch',
			vi.fn(async () => {
				throw new Error('offline')
			}),
		)
		await rm(emittedDir, { force: true, recursive: true })
		await mkdir(emittedDir, { recursive: true })

		const secondImage = await getResponsiveImage(remoteUrl, 'cat')

		expect(secondImage.src).toBe(firstImage.src)
		expect(secondImage.srcSet).toBe(firstImage.srcSet)
		expect(await readFiles(emittedDir)).toHaveLength(8)
	})

	it('changes public filenames when remote content changes', async () => {
		vi.stubGlobal('fetch', mockImageFetch(await createPng('#0000ff')))
		const firstImage = await getResponsiveImage(remoteUrl, 'cat')

		vi.stubGlobal('fetch', mockImageFetch(await createPng('#ffff00')))
		const secondImage = await getResponsiveImage(remoteUrl, 'cat')

		expect(secondImage.src).not.toBe(firstImage.src)
		expect(await readFiles(join(cacheRoot, 'originals'))).toHaveLength(2)
	})
})
