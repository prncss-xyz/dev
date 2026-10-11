import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'

import { colors } from '@/layouts/tokens/colors.stylex'

import './reset.css'
import './syntax-highlighting.css'

type RootElementProps = { children: ReactNode }

const styles = stylex.create({
	root: {
		backgroundColor: colors.background,
		color: colors.text,
		overflowY: 'auto',
		scrollbarWidth: 'none',
	},
})

export default async function RootElement({ children }: RootElementProps) {
	return (
		<html lang='en' {...stylex.props(styles.root)}>
			<head>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
			</head>
			<body>{children}</body>
		</html>
	)
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
