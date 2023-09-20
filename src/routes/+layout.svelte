<script lang="ts">
	import '../app.css';
	import Transition from './Transition.svelte';
	import 'open-props/style'
	import 'open-props/normalize'
	import 'open-props/buttons'
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';

	export let data;
</script>


<div class ="layout">
	<Header />
	<main>
		<Transition url={data.url}><slot/></Transition>
	</main>

	<Footer />
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