'use client'

import * as stylex from '@stylexjs/stylex'
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'

const styles = stylex.create({
	header: (hidden: number) => ({
		position: 'sticky',
		top: -hidden,
	}),
})

type HeaderProps = {
	children?: ReactNode
	style?: stylex.StyleXStyles
}

export function Header({ children, style }: HeaderProps) {
	const ref = useRef<HTMLElement>(null)
	const [hidden, setHidden] = useState(0)

	useLayoutEffect(() => {
		const header = ref.current
		if (!header) return

		// Clamp overscroll so bouncing at either end cannot reverse the navbar.
		function scrollPosition() {
			return Math.max(
				0,
				Math.min(
					window.scrollY,
					document.documentElement.scrollHeight - window.innerHeight,
				),
			)
		}
		let previous = scrollPosition()
		let offset = Math.min(previous, header.getBoundingClientRect().height)
		setHidden(offset)

		function update() {
			const current = scrollPosition()
			const height = header!.getBoundingClientRect().height
			// Each pixel scrolled reveals or hides one pixel, including on reversal.
			offset = Math.max(
				0,
				Math.min(height, offset + current - previous, current),
			)
			previous = current
			setHidden(offset)
		}
		const observer = new ResizeObserver(update)
		observer.observe(header)
		window.addEventListener('scroll', update, { passive: true })
		window.addEventListener('resize', update)
		return () => {
			observer.disconnect()
			window.removeEventListener('scroll', update)
			window.removeEventListener('resize', update)
		}
	}, [])

	return (
		<header ref={ref} {...stylex.props(style, styles.header(hidden))}>
			{children}
		</header>
	)
}
