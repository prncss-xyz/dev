import { allBlogs } from 'content-collections'

import { NavLink } from '@/components/NavLink'

const page = getPage('blog')

import { PageMeta } from '@/components/PageMeta'
import { Col } from '@/layouts/Box'
import { H2 } from '@/layouts/elements/Heading'
import { MD } from '@/layouts/MD'
import { globalMessages } from '@/messages'
import { getPage } from '@/utils/getPage'

// Sort posts by date from latest to oldest
const sortedBlogs = allBlogs.toSorted(
	(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
)

export default async function PostsIndex() {
	return (
		<Col p={5} grow={1}>
			<PageMeta {...page} />
			<MD>{page.content}</MD>
			{sortedBlogs.length ? (
				<Col as='ul' gap={6}>
					{sortedBlogs.map((post) => (
						<li key={post.slug}>
							<NavLink to={`/blog/${post._meta.path}`}>
								<Col>
									<H2 textAlign='left'>{post.title}</H2>
									<div>{post.date}</div>
								</Col>
							</NavLink>
						</li>
					))}
				</Col>
			) : (
				globalMessages.comingSoon
			)}
		</Col>
	)
}

export async function getConfig() {
	return {
		render: 'static',
	} as const
}
