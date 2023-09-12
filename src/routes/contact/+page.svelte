<svelte:head>
	<title>Contact</title>
	<meta name="description" content="Contact" />
</svelte:head>

<script lang="ts">
	import ActiveLink from "../ActiveLink.svelte";

	let contacts = [
		{
			name: 'Email me at tyler.j.jackson@outlook.com',
			href: 'mailto:tyler.j.jackson@outlook.com'
		},
		{
			name: 'LinkedIn',
			href: 'https://www.linkedin.com/in/tylerjjackson'
		},
	];
	
</script>

<h1 class="dark:text-white dark-dark-900">
	<div class="flex flex-col items-baseline space-x-4">
		<ul class="list-disc pl-6">
			{#each contacts as { name, href }}
				<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
				<li><a href={href} class="text-base text-blue-500  dark:text-blue-200 font-bold"
					target="_blank">
					{name}
				</a></li>
			{/each}
		</ul>
	</div>
</h1>
