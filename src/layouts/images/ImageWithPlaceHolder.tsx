'use client'
import * as stylex from '@stylexjs/stylex'
import { useEffect, useRef, useState } from 'react'

import { Box, type BoxProps } from '../Box'
import { type ResponsiveImage } from './responsiveImage'

const styles = stylex.create({
	container: {
		placeItems: 'center',
		display: 'inline-grid',
	},
	content: {
		gridColumnStart: '1',
		gridRowStart: '1',
	},
	hidden: {
		opacity: 0,
		pointerEvents: 'none',
	},
})

export function ImageWithPlaceHolder({
	image: { alt, height, placeholder, src, srcSet, width },
	imgStyle,
	style,
	...rest
}: BoxProps<'span'> & {
	image: ResponsiveImage
	imgStyle?: stylex.StyleXStyles
}) {
	const [loaded, setLoaded] = useState(false)
	const imgRef = useRef<HTMLImageElement>(null)
	useEffect(() => {
		if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
			setLoaded(true)
		}
	}, [])
	return (
		<Box as='span' {...rest} style={[styles.container, style]}>
			<img
				alt={alt}
				aria-hidden='true'
				height={height}
				src={placeholder}
				width={width}
				{...stylex.props([styles.content, imgStyle, loaded && styles.hidden])}
			/>
			<img
				alt={alt}
				height={height}
				onLoad={() => setLoaded(true)}
				onError={() => setLoaded(false)}
				ref={imgRef}
				src={src}
				srcSet={srcSet}
				width={width}
				{...stylex.props([styles.content, imgStyle, !loaded && styles.hidden])}
			/>
		</Box>
	)
}
