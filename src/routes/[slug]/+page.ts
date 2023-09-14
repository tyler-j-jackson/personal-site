import { error } from '@sveltejs/kit'

export async function load({ params }) {
	try {
		const post = await import(`../../lib/posts/${params.slug}.md`) // mdsvex-loader will handle this import

		return {
			content: post.default,
			meta: post.metadata
		}
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`)
	}
}