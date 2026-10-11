'use client'

import { OverlayScrollbars } from 'overlayscrollbars'
import { useLayoutEffect } from 'react'

import 'overlayscrollbars/overlayscrollbars.css'

export function DocumentScrollbars() {
	useLayoutEffect(() => {
		const instance = OverlayScrollbars(
			{
				target: document.body,
				// Keep the document as the viewport for native page scrolling.
				elements: { viewport: document.body },
				cancel: { body: false },
			},
			{
				scrollbars: {
					theme: 'os-theme-light',
					visibility: 'auto',
				},
			},
		)

		return () => instance.destroy()
	}, [])

	return null
}
