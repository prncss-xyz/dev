import * as stylex from '@stylexjs/stylex'

import { NavLink } from '@/components/NavLink'

import { fontSizes } from '../tokens/fontSizes.stylex'
import { fontWeights } from '../tokens/fontWeights.stylex'
import { type ReElemProps } from './types'

const styles = stylex.create({
	base: {
		fontSize: fontSizes[2],
		fontWeight: fontWeights.bold,
	},
})

export function A({ children, href, style, ...rest }: ReElemProps<'a'>) {
	if (href && (href.startsWith('/') || href.startsWith('.')))
		return (
			<NavLink
				to={href as any}
				{...rest}
				{...stylex.props([styles.base, style])}
			>
				{children}
			</NavLink>
		)
	return (
		<a
			href={href}
			target='_blank'
			rel='noreferrer'
			{...rest}
			{...stylex.props([styles.base, style])}
		>
			{children}
		</a>
	)
}
