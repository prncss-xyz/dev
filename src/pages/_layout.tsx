import * as stylex from '@stylexjs/stylex'
import { allPages, settings } from 'content-collections'
import type { ReactNode } from 'react'

import { NavLink } from '@/components/NavLink'
import { PageContents } from '@/components/PageContents'
import { PageMeta } from '@/components/PageMeta'
import { LinkIcons } from '@/features/IconLinks'
import { Box, Col, Row } from '@/layouts/Box'
import { DevStyleXInject } from '@/layouts/DevStyleXInject'
import { DocumentScrollbars } from '@/layouts/DocumentScrollbars'
import { Header } from '@/layouts/Header'
import { borderRadii } from '@/layouts/tokens/borderRadii.stylex'
import { breakpoints } from '@/layouts/tokens/breakpoints.stylex'
import { colors } from '@/layouts/tokens/colors.stylex'
import { sizes } from '@/layouts/tokens/sizes.stylex'
import { spaces } from '@/layouts/tokens/spaces.stylex'
import { basePath } from '@/meta'
const { title, description } = settings

const styles = stylex.create({
	root: {
		paddingTop: {
			default: spaces[4],
			[breakpoints.md]: spaces[7],
		},
	},
	header: {
		width: sizes.full,
		zIndex: 10,
		backgroundColor: colors.background,
		backgroundImage: `linear-gradient(${colors.text}, ${colors.text})`,
		backgroundPosition: 'bottom',
		backgroundRepeat: 'no-repeat',
		backgroundSize: {
			default: '100% 1px',
			'@media (min-resolution: 2dppx)': '100% 0.5px',
			'@media (min-resolution: 3dppx)': '100% 0.333333px',
		},
	},
	headerContents: {
		// Keep an opaque background behind the links for contrast checking,
		// while leaving the bottom padding clear for the header's hairline.
		backgroundColor: colors.background,
		backgroundClip: 'content-box',
		paddingLeft: {
			default: spaces[5],
			[breakpoints.md]: '0px',
		},
		paddingRight: {
			default: spaces[5],
			[breakpoints.md]: '0px',
		},
	},
	navLink: {
		color: {
			default: colors.muted,
			':is([aria-current="page"])': colors.text,
		},
	},
	panel: {
		borderRadius: {
			default: '0px',
			[breakpoints.md]: borderRadii[1],
		},
	},
	contentPanel: {
		paddingTop: {
			default: spaces[7],
			[breakpoints.md]: spaces[8],
		},
		backgroundColor: '#303030',
		backgroundImage: `url("${stylex.env.basePath}images/hex-pattern.svg")`,
		backgroundPosition: '0 -44.500383px',
		backgroundRepeat: 'repeat',
	},
})

export default async function RootLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
		<Col
			style={styles.root}
			fontFamily='base'
			minH='screen'
			align='center'
			justify='between'
		>
			<PageMeta title={title} description={description} />
			<link
				rel='icon'
				type='image/svg+xml'
				href={basePath + 'images/favicon.svg'}
			/>
			<DevStyleXInject />
			<DocumentScrollbars />
			<Header style={styles.header}>
				<Col w='full' align='center'>
					<Row
						style={styles.headerContents}
						pb={4}
						gap={5}
						maxW='full'
						w='readable'
						wrap
						align='center'
						justify='between'
					>
						<Box as={NavLink} to='/' fontSize={5}>
							{title}
						</Box>
						<Row gap={5} wrap>
							{allPages.map(({ slug, title }) => {
								const to = '/' + (slug === 'about' ? '' : slug)
								return (
									<Box
										as={NavLink}
										key={to}
										to={to}
										style={styles.navLink}
										fontSize={4}
									>
										{title}
									</Box>
								)
							})}
						</Row>
					</Row>
				</Col>
			</Header>
			<Col
				style={styles.contentPanel}
				w='full'
				grow={1}
				pb={6}
				gap={7}
				align='center'
				justify='between'
			>
				<Col
					bg='background'
					style={styles.panel}
					maxW='full'
					w='readable'
					grow={1}
					as='main'
				>
					<PageContents>{children}</PageContents>
				</Col>
				<Row
					maxW='full'
					w='readable'
					style={styles.panel}
					justify='center'
					py={4}
					color='accent'
					bg='background'
					gap={4}
					as='footer'
				>
					<LinkIcons />
				</Row>
			</Col>
		</Col>
	)
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
