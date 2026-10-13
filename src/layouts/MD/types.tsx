import * as stylex from '@stylexjs/stylex'
import { type ComponentProps } from 'react'

type ElemProps<
	T extends
		| keyof React.JSX.IntrinsicElements
		| React.JSXElementConstructor<any>,
> = ComponentProps<T>

export type ReElemProps<
	T extends
		| keyof React.JSX.IntrinsicElements
		| React.JSXElementConstructor<any>,
> = Omit<ElemProps<T>, 'style' | 'classname'> & {
	style?: stylex.StyleXStyles
}
