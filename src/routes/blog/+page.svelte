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
        @apply grid gap-8;
    }

    .post {
        @apply max-w-screen-md;
    }

    .post:not(:last-child) {
        @apply border-b border-gray-300 pb-8 last:border-b-0;
    }

    .title {
        @apply text-4xl capitalize;
    }

    .date {
        @apply text-gray-600;
    }

    .description {
        @apply mt-4;
    }
</style>