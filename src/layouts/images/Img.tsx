import * as stylex from '@stylexjs/stylex'

import { Box, type BoxProps } from '../Box'
import { getResponsiveImage } from '../images/getResponsiveImage'
import { ImageWithPlaceHolder } from './ImageWithPlaceHolder'

const styles = stylex.create({
	container: {
		flexGrow: 0,
		width: '100%',
	},
	image: {
		display: 'block',
		height: 'auto',
		maxHeight: 'inherit',
		maxWidth: '100%',
		objectFit: 'contain',
		width: 'auto',
	},
	fallbackImage: {
		display: 'block',
		height: 'auto',
		maxHeight: '50vh',
		maxWidth: '100%',
		objectFit: 'contain',
		width: 'auto',
		marginInline: 'auto',
	},
})

export async function Img({
	alt,
	src,
	style,
	...rest
}: BoxProps<'span'> & BoxProps<'img'>) {
	if (src) {
		if (src.startsWith('data:'))
			return (
				<Box
					as='img'
					alt={alt}
					src={src}
					{...rest}
					{...stylex.props([styles.fallbackImage, style])}
				/>
			)
		const image = await getResponsiveImage(src, alt).catch(() => null)
		return image ? (
			<ImageWithPlaceHolder
				image={image}
				imgStyle={styles.image}
				maxH='halfScreen'
				{...rest}
				style={[styles.container, style]}
			/>
		) : (
			<Box
				as='img'
				alt={alt}
				src={src}
				{...rest}
				{...stylex.props([styles.fallbackImage, style])}
			/>
		)
	}
	return null
}
