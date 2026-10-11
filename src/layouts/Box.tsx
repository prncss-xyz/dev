import * as stylex from '@stylexjs/stylex'

import { borderRadii } from './tokens/borderRadii.stylex'
import { borderWidth } from './tokens/borderWidth.stylex'
import { colors } from './tokens/colors.stylex'
import { fontFamilies } from './tokens/fontFamilies.stylex'
import { fontSizes } from './tokens/fontSizes.stylex'
import { fontWeights } from './tokens/fontWeights.stylex'
import { sizes } from './tokens/sizes.stylex'
import { spaces } from './tokens/spaces.stylex'

const heightVariants = stylex.create({
	full: { height: sizes.full },
	readable: { height: sizes.readable },
	halfScreen: { height: '50vh' },
	screen: { height: '100vh' },
})

const widthVariants = stylex.create({
	full: { width: sizes.full },
	readable: { width: sizes.readable },
	halfScreen: { width: '50vw' },
	screen: { width: '100vw' },
})

const minWidthVariants = stylex.create({
	full: { minWidth: sizes.full },
	readable: { minWidth: sizes.readable },
	halfScreen: { minWidth: '50vw' },
	screen: { minWidth: '100vw' },
})

const maxWidthVariants = stylex.create({
	full: { maxWidth: sizes.full },
	readable: { maxWidth: sizes.readable },
	halfScreen: { maxWidth: '50vw' },
	screen: { maxWidth: '100vw' },
})

const minHeightVariants = stylex.create({
	full: { minHeight: sizes.full },
	readable: { minHeight: sizes.readable },
	halfScreen: { minHeight: '50vh' },
	screen: { minHeight: '100vh' },
})

const maxHeightVariants = stylex.create({
	full: { maxHeight: sizes.full },
	readable: { maxHeight: sizes.readable },
	halfScreen: { maxHeight: '50vh' },
	screen: { maxHeight: '100vh' },
})

const flexVariants = stylex.create({
	col: {
		display: 'flex',
		flexDirection: 'column',
	},
	row: {
		display: 'flex',
		flexDirection: 'row',
	},
})

const wrapVariants = stylex.create({
	wrap: { flexWrap: 'wrap' },
	nowrap: { flexWrap: 'nowrap' },
})

const justifyVariants = stylex.create({
	around: {
		justifyContent: 'space-around',
	},
	between: {
		justifyContent: 'space-between',
	},
	center: {
		justifyContent: 'center',
	},
	end: {
		justifyContent: 'flex-end',
	},
	start: {
		justifyContent: 'flex-start',
	},
})

const alignVariants = stylex.create({
	baseline: {
		alignItems: 'baseline',
	},
	center: {
		alignItems: 'center',
	},
	end: {
		alignItems: 'flex-end',
	},
	start: {
		alignItems: 'flex-start',
	},
	stretch: {
		alignItems: 'stretch',
	},
})

const pVariants = stylex.create({
	1: { padding: spaces[1] },
	2: { padding: spaces[2] },
	3: { padding: spaces[3] },
	4: { padding: spaces[4] },
	5: { padding: spaces[5] },
	6: { padding: spaces[6] },
	7: { padding: spaces[7] },
	8: { padding: spaces[8] },
})

const ptVariants = stylex.create({
	1: { paddingTop: spaces[1] },
	2: { paddingTop: spaces[2] },
	3: { paddingTop: spaces[3] },
	4: { paddingTop: spaces[4] },
	5: { paddingTop: spaces[5] },
	6: { paddingTop: spaces[6] },
	7: { paddingTop: spaces[7] },
	8: { paddingTop: spaces[8] },
})

const pbVariants = stylex.create({
	1: { paddingBottom: spaces[1] },
	2: { paddingBottom: spaces[2] },
	3: { paddingBottom: spaces[3] },
	4: { paddingBottom: spaces[4] },
	5: { paddingBottom: spaces[5] },
	6: { paddingBottom: spaces[6] },
	7: { paddingBottom: spaces[7] },
	8: { paddingBottom: spaces[8] },
})

const plVariants = stylex.create({
	1: { paddingLeft: spaces[1] },
	2: { paddingLeft: spaces[2] },
	3: { paddingLeft: spaces[3] },
	4: { paddingLeft: spaces[4] },
	5: { paddingLeft: spaces[5] },
	6: { paddingLeft: spaces[6] },
	7: { paddingLeft: spaces[7] },
	8: { paddingLeft: spaces[8] },
})

const prVariants = stylex.create({
	1: { paddingRight: spaces[1] },
	2: { paddingRight: spaces[2] },
	3: { paddingRight: spaces[3] },
	4: { paddingRight: spaces[4] },
	5: { paddingRight: spaces[5] },
	6: { paddingRight: spaces[6] },
	7: { paddingRight: spaces[7] },
	8: { paddingRight: spaces[8] },
})

const pxVariants = stylex.create({
	1: {
		paddingLeft: spaces[1],
		paddingRight: spaces[1],
	},
	2: {
		paddingLeft: spaces[2],
		paddingRight: spaces[2],
	},
	3: {
		paddingLeft: spaces[3],
		paddingRight: spaces[3],
	},
	4: {
		paddingLeft: spaces[4],
		paddingRight: spaces[4],
	},
	5: {
		paddingLeft: spaces[5],
		paddingRight: spaces[5],
	},
	6: {
		paddingLeft: spaces[6],
		paddingRight: spaces[6],
	},
	7: {
		paddingLeft: spaces[7],
		paddingRight: spaces[7],
	},
	8: {
		paddingLeft: spaces[8],
		paddingRight: spaces[8],
	},
})

const pyVariants = stylex.create({
	1: {
		paddingBottom: spaces[1],
		paddingTop: spaces[1],
	},
	2: {
		paddingBottom: spaces[2],
		paddingTop: spaces[2],
	},
	3: {
		paddingBottom: spaces[3],
		paddingTop: spaces[3],
	},
	4: {
		paddingBottom: spaces[4],
		paddingTop: spaces[4],
	},
	5: {
		paddingBottom: spaces[5],
		paddingTop: spaces[5],
	},
	6: {
		paddingBottom: spaces[6],
		paddingTop: spaces[6],
	},
	7: {
		paddingBottom: spaces[7],
		paddingTop: spaces[7],
	},
	8: {
		paddingBottom: spaces[8],
		paddingTop: spaces[8],
	},
})

const fontFamilyVariants = stylex.create({
	base: { fontFamily: fontFamilies.base },
	heading: { fontFamily: fontFamilies.heading },
})

const fontSizeVariants = stylex.create({
	1: { fontSize: fontSizes[1] },
	2: { fontSize: fontSizes[2] },
	3: { fontSize: fontSizes[3] },
	4: { fontSize: fontSizes[4] },
	5: { fontSize: fontSizes[5] },
	6: { fontSize: fontSizes[6] },
})

const fontWeightVariants = stylex.create({
	light: { fontWeight: fontWeights.light },
	normal: { fontWeight: fontWeights.normal },
	semi: { fontWeight: fontWeights.semi },
	bold: { fontWeight: fontWeights.bold },
})

const fontVariants = stylex.create({
	italic: { fontStyle: 'italic' },
	underline: { textDecoration: 'underline' },
	monospace: { fontFamily: fontFamilies.monospace },
})

const gapVariants = stylex.create({
	1: { gap: spaces[1] },
	2: { gap: spaces[2] },
	3: { gap: spaces[3] },
	4: { gap: spaces[4] },
	5: { gap: spaces[5] },
	6: { gap: spaces[6] },
	7: { gap: spaces[7] },
	8: { gap: spaces[8] },
})

const growVariants = stylex.create({
	1: { flexGrow: 1 },
})

const textAlignVariants = stylex.create({
	center: { textAlign: 'center' },
	left: { textAlign: 'left' },
})

const colorVariants = stylex.create({
	background: { color: colors.background },
	text: { color: colors.text },
	muted: { color: colors.muted },
	primary: { color: colors.primary },
	accent: { color: colors.accent },
	accentBg: { color: colors.accentBg },
})

const backgroundVariants = stylex.create({
	background: { backgroundColor: colors.background },
	text: { backgroundColor: colors.text },
	muted: { backgroundColor: colors.muted },
	primary: { backgroundColor: colors.primary },
	accent: { backgroundColor: colors.accent },
	accentBg: { backgroundColor: colors.accentBg },
})

const borderColorVariants = stylex.create({
	background: { borderColor: colors.background },
	text: { borderColor: colors.text },
	muted: { borderColor: colors.muted },
	primary: { borderColor: colors.primary },
	accent: { borderColor: colors.accent },
	accentBg: { borderColor: colors.accentBg },
})

const borderRadiusVariants = stylex.create({
	1: { borderRadius: borderRadii[1] },
	round: { borderRadius: borderRadii.round },
})

const borderWidthVariants = stylex.create({
	none: { borderWidth: borderWidth.none },
	thin: { borderWidth: borderWidth.thin },
	thick: { borderWidth: borderWidth.thick },
})

const borderVariants = stylex.create({
	bottom: { borderBottomStyle: 'solid' },
	around: { borderStyle: 'solid' },
})

type BoxBaseProps<E extends React.ElementType = React.ElementType> = {
	align?: keyof typeof alignVariants
	as?: E
	flex?: keyof typeof flexVariants
	wrap?: boolean
	fontFamily?: keyof typeof fontFamilyVariants
	fontSize?: keyof typeof fontSizeVariants
	fontWeight?: keyof typeof fontWeightVariants
	italic?: boolean
	underline?: boolean
	monospace?: boolean
	gap?: keyof typeof gapVariants
	grow?: keyof typeof growVariants
	h?: keyof typeof heightVariants
	justify?: keyof typeof justifyVariants
	maxH?: keyof typeof maxHeightVariants
	maxW?: keyof typeof maxWidthVariants
	minH?: keyof typeof minHeightVariants
	minW?: keyof typeof minWidthVariants
	textAlign?: keyof typeof textAlignVariants
	color?: keyof typeof colorVariants
	bg?: keyof typeof backgroundVariants
	borderColor?: keyof typeof borderColorVariants
	border?: keyof typeof borderVariants
	borderRadius?: keyof typeof borderRadiusVariants
	borderWidth?: keyof typeof borderWidthVariants
	w?: keyof typeof widthVariants
	p?: keyof typeof pVariants
	pb?: keyof typeof pbVariants
	pl?: keyof typeof plVariants
	pr?: keyof typeof prVariants
	pt?: keyof typeof ptVariants
	px?: keyof typeof pxVariants
	py?: keyof typeof pyVariants
	style?: stylex.StyleXStyles
}

export type BoxProps<E extends React.ElementType> = BoxBaseProps<E> &
	Omit<
		React.ComponentProps<E>,
		keyof BoxBaseProps | 'className' | 'style' | 'color' | 'background'
	>

const defaultElement = 'div'

export function Box<E extends React.ElementType = typeof defaultElement>({
	align,
	as,
	flex,
	wrap,
	fontFamily,
	fontSize,
	fontWeight,
	italic,
	underline,
	monospace,
	gap,
	grow,
	h,
	justify,
	maxH,
	maxW,
	minH,
	minW,
	textAlign,
	color,
	bg: background,
	borderColor,
	border,
	borderRadius,
	borderWidth,
	w,
	p,
	pb,
	pl,
	pr,
	pt,
	px,
	py,
	style,
	...rest
}: BoxProps<E>) {
	const Element = as || defaultElement
	const { ...elementProps } = rest as typeof rest
	const styleProps = stylex.props([
		flex && flexVariants[flex],
		wrap != null && wrapVariants[wrap ? 'wrap' : 'nowrap'],
		h && heightVariants[h],
		maxH && maxHeightVariants[maxH],
		maxW && maxWidthVariants[maxW],
		minH && minHeightVariants[minH],
		minW && minWidthVariants[minW],
		w && widthVariants[w],
		p && pVariants[p],
		pb && pbVariants[pb],
		pl && plVariants[pl],
		pr && prVariants[pr],
		pt && ptVariants[pt],
		fontFamily && fontFamilyVariants[fontFamily],
		fontSize && fontSizeVariants[fontSize],
		fontWeight && fontWeightVariants[fontWeight],
		italic && fontVariants.italic,
		underline && fontVariants.underline,
		monospace && fontVariants.monospace,
		px && pxVariants[px],
		py && pyVariants[py],
		gap && gapVariants[gap],
		grow && growVariants[grow],
		align && alignVariants[align],
		justify && justifyVariants[justify],
		textAlign && textAlignVariants[textAlign],
		color && colorVariants[color],
		background && backgroundVariants[background],
		borderColor && borderColorVariants[borderColor],
		border && borderVariants[border],
		borderRadius && borderRadiusVariants[borderRadius],
		borderWidth && borderWidthVariants[borderWidth],
		style,
	])

	return <Element {...elementProps} {...styleProps} />
}

export function Row<E extends React.ElementType = typeof defaultElement>(
	props: BoxProps<E>,
) {
	return <Box flex='row' {...props} />
}

export function Col<E extends React.ElementType = typeof defaultElement>({
	...rest
}: BoxProps<E>) {
	return <Box flex='col' {...rest} />
}
