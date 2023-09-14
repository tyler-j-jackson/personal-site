<script lang="ts">
	import { formatDate } from '$lib/utils'

	export let data
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
  <!-- Title -->
	<hgroup>
		<h1 class="dark:text-gray-500">{data.meta.title}</h1>
		<p>Published at {formatDate(data.meta.date)}</p>
	</hgroup>

  <!-- Tags -->
	<div class="tags dark:text-white">
		{#each data.meta.categories as category}
			<span class="surface-4">&num;{category}</span>
		{/each}
	</div>

  <!-- Post -->
	<div class="prose dark:text-white">
		<svelte:component this={data.content} />
	</div>
</article>

<style>
    .article {
        @apply max-w-screen-md mx-auto;
    }

    h1 {
        @apply text-4xl capitalize;
    }

    h1 + p {
        @apply mt-2 text-gray-600;
    }

    .tags {
        @apply flex gap-3 mt-7;
    }

    .tags > * {
        @apply py-2 px-3 rounded-full;
    }
</style>
