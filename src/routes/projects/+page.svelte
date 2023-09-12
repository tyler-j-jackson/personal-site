<svelte:head>
    <title>Projects</title>
    <meta name="description" content="Projects" />
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    const projects = [
        {
            name: 'WIP AI project',
            href: ''
        },
        {
            name: 'Video game',
            href: ''
        }
    ]
</script>

<h1 class="dark:text-white dark-dark-900">
	<div class="flex flex-col items-baseline space-x-4">
        <ul class="list-disc pl-6">
            {#each projects as project}
                <li><a class="text-base text-blue-500  dark:text-blue-200 font-bold" href={project.href}>{project.name}</a></li>
            {/each}
        </ul>   
	</div>
</h1>
