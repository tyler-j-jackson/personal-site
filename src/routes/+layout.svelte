<script lang="ts">
	
	import Footer from '../Footer.svelte'
	import Header from '../Header.svelte'

	import '../app.css';
	import Navbar from './Navbar.svelte';
</script>

<div class="min-h-full">
	<Navbar />

	<!--header class="bg-white dark:bg-gray-900 shadow">
		<div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">Dashboard</h1>
		</div>
	</header-->
	<main>
		<div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
			<!-- Replace with your content -->
			<div class="px-4 py-6 sm:px-0">
				<div class="min-h-[100px] rounded-lg border-4 border-dashed border-gray-500 dark:border-gray-100 box-inward-padding p-2.5">
					<slot />
				</div>
			</div>
			<!-- /End replace -->
		</div>
	</main>
</div>

<!--Footer-->
<!--
<div class="fixed bottom-0 w-full bg-white dark:bg-gray-900 p-4">
	<p class="text-center text-gray-700 dark:text-white">This is some content at the bottom of the page.</p>
  </div>
-->

<style>
	.layout {
		height: 100%;
		max-inline-size: 1440px;
		display: grid;
		grid-template-rows: auto 1fr auto;
		margin-inline: auto;
		padding-inline: var(--size-7);
	}

	main {
		padding-block: var(--size-9);
	}

	@media (min-width: 1440px) {
		.layout {
			padding-inline: 0;
		}
	}
</style>