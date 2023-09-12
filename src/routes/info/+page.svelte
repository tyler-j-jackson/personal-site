<!-- page.svelte -->

<svelte:head>
	<title>Info</title>
	<meta name="description" content="Info" />
</svelte:head>
<!-- Inside your Svelte component script -->
<script>
	let languages = [
		"C#",
		"Python",
		"TypeScript",
		"JavaScript",
		"HTML",
		"CSS",
		"Svelte",
		"SQL",
	];

	let tools = [
		"CI/CD",
		"Azure",
		"Linux",
		"Docker",
		"ASP.NET Core",
		"Node",
		"Sveltekit",
		"React",
		"Angular",
		"AWS",
	];
</script>

<h1 class="dark:text-white dark-dark-900">
	<div class="flex flex-col items-baseline space-x-4">
		<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
		<a class="text-blue-500 font-bold" href="https://tylerpersonalsitebucket.s3.us-west-2.amazonaws.com/TylerJacksonSoftwareEngineer.pdf" target="_blank">My resume.</a>
	</div>
</h1>

<div class="my-4">
	<h2 class="text-2xl font-semibold mb-2 dark:text-gray-500">Languages:</h2>
	<ul class="list-disc pl-6">
		{#each languages as language}
			<li class="text-base text-gray-700 dark:text-white">{language}</li>
		{/each}
	</ul>
</div>

<div class="my-4">
	<h2 class="text-2xl font-semibold mb-2 dark:text-gray-500">Tools/Frameworks/Concepts:</h2>
	<ul class="list-disc pl-6">
		{#each tools as tool}
			<li class="text-base text-gray-700 dark:text-white">{tool}</li>
		{/each}
	</ul>
</div>