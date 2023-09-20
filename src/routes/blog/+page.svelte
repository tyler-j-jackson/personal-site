<script lang="ts">
	import { formatDate } from '$lib/utils'

	export let data
</script>

<svelte:head>
    <title>Blog</title>
    <meta name="description" content="Blog" />
</svelte:head>

<!-- Posts -->
<section>
	<ul class="posts">
		{#each data.posts as post}
			<li class="post">
				<a href={post.slug} class="title dark:text-gray-500">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description dark:text-white">{post.description}</p>
			</li>
		{/each}
	</ul>
</section>


<style>
	.posts {
		display: grid;
		gap: 2rem;
	}

	.post {
		max-inline-size: var(--size-content-3);
	}

	.post:not(:last-child) {
		border-bottom: 1px solid var(--border);
		padding-bottom: var(--size-7);
	}

	.title {
		font-size: var(--font-size-fluid-3);
		text-transform: capitalize;
	}

	.date {
		color: var(--text-2);
	}

	.description {
		margin-top: var(--size-3);
	}
</style>