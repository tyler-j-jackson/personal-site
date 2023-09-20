<script lang="ts">
	import * as config from '$lib/config'
	import ThemeToggle from './ThemeToggle.svelte';
	let links = [
		{
			href: '/',
			title: 'Home'
		},
		{
			href:'/projects',
			title: 'Projects'
		},
		{
			href: '/info',
			title: 'Info'
		},
		{
			href: '/contact',
			title: 'Contact'
		},
		{
			href: '/blog',
			title: 'Blog'
		}
	];
</script>

<nav>
  <!-- Title -->
	<a href="/" class="title">
		<b>{config.title}</b>
	</a>

  <!-- Navigation -->
  <ul class="links">
  {#each links as {href, title}}
	<li>
		<a href = {href}>{title}</a>
	</li>
	
  {/each}
  </ul>
  <!-- Theme -->
  <!--ThemeToggle /-->
</nav>

<style>
	nav {
		padding-block: var(--size-7);
	}

	.links {
		margin-block: var(--size-7);
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	@media (min-width: 768px) {
		nav {
			display: flex;
			justify-content: space-between;
		}

		.links {
			display: flex;
			gap: var(--size-7);
			margin-block: 0;
		}
	}
</style>
