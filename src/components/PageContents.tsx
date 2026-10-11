'use client'

import * as stylex from '@stylexjs/stylex'
import { type ReactNode, useLayoutEffect, useRef } from 'react'
import { useRouter } from 'waku'

import { Col } from '@/layouts/Box'
import { animationDurations } from '@/layouts/tokens/animationDurations.stylex'

const styles = stylex.create({
	layers: { position: 'relative', isolation: 'isolate' },
	content: {
		animationDuration: animationDurations.normal,
	},
	crossfade: {
		// StyleX's validator does not yet recognize plus-lighter.
		// oxlint-disable-next-line stylex/valid-styles
		mixBlendMode: 'plus-lighter',
	},
	outgoing: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		pointerEvents: 'none',
	},
})

function startCrossfade(
	layers: HTMLElement,
	content: HTMLElement,
	outgoing: HTMLElement,
	duration: number,
) {
	const { className } = stylex.props(styles.outgoing)
	if (className) outgoing.classList.add(...className.split(' '))
	outgoing.inert = true
	outgoing.setAttribute('aria-hidden', 'true')
	layers.append(outgoing)
	const blendClasses =
		stylex.props(styles.crossfade).className?.split(' ') ?? []
	content.classList.add(...blendClasses)
	outgoing.classList.add(...blendClasses)

	const options = { duration, easing: 'linear', fill: 'both' as const }
	const animations = [
		outgoing.animate({ opacity: [1, 0] }, options),
		content.animate({ opacity: [0, 1] }, options),
	]
	let cleanedUp = false
	function cleanup() {
		if (cleanedUp) return
		cleanedUp = true
		content.classList.remove(...blendClasses)
		outgoing.classList.remove(...blendClasses)
		animations.forEach((animation) => animation.cancel())
		outgoing.remove()
	}
	void Promise.all(animations.map((animation) => animation.finished)).then(
		cleanup,
		cleanup,
	)
	return cleanup
}

// Waku's route children resolve through context, so retaining the ReactNode
// would render the new page twice. Keep a DOM copy of the committed page.
export function PageContents({ children }: { children: ReactNode }) {
	const layersRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const previousPage = useRef<{ path: string; snapshot: HTMLElement } | null>(
		null,
	)
	const { path } = useRouter()

	useLayoutEffect(() => {
		const content = contentRef.current
		const layers = layersRef.current
		if (!content || !layers) return

		const previous = previousPage.current
		function capture() {
			if (!content) return
			previousPage.current = {
				path,
				snapshot: content.cloneNode(true) as HTMLElement,
			}
		}
		capture()
		// Keep the copy current when descendants update without a route change.
		const observer = new MutationObserver(capture)
		observer.observe(content, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
		})

		const duration =
			Number.parseFloat(getComputedStyle(content).animationDuration) * 1000
		const clearAnimation =
			previous && previous.path !== path && duration > 0
				? startCrossfade(layers, content, previous.snapshot, duration)
				: undefined

		return () => {
			observer.disconnect()
			clearAnimation?.()
		}
	}, [path])

	return (
		<Col ref={layersRef} grow={1} style={styles.layers}>
			<Col ref={contentRef} grow={1} style={styles.content}>
				{children}
			</Col>
		</Col>
	)
}
