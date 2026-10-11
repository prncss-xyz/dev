import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'

import { PageMeta } from '@/components/PageMeta'
import { Box } from '@/layouts/Box'
import { markdownElements } from '@/layouts/MD'
import { createMD } from '@/layouts/MD/createMD'
import { colors } from '@/layouts/tokens/colors.stylex'
import { getPage } from '@/utils/getPage'

const styles = stylex.create({
	lighterSection: {
		backgroundColor: colors.accentBg,
	},
})

function Section({ children, index }: { children?: ReactNode; index: number }) {
	return (
		<Box as='section' p={5} style={index % 2 === 1 && styles.lighterSection}>
			{children}
		</Box>
	)
}

const MD = createMD(markdownElements, Section)

const page = getPage('about')

export default async function HomePage() {
	return (
		<>
			<PageMeta {...page} />
			<MD>{page.content}</MD>
		</>
	)
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
