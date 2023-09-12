<svelte:head>
	<title>Home</title>
	<meta name="home" content="Tyler Jackson Software Engineer" />
</svelte:head>

<script>
	const sections =[
		{
			header: 'About Me',
			content: 'I\'m Tyler, a passionate software engineer with a diverse range of experiences in the world of technology. My journey in software development has been both professional and personal, allowing me to explore various aspects of this ever-evolving field.',
		},
		{
			header: 'Professional Experience',
			content: 'I\'ve had the privilege of working on exciting projects that have honed my skills and broadened my horizons. With hands-on experience in deploying microservices, cloud infrastructure, and CI/CD pipelines, I\'ve contributed to the development of robust, scalable systems. My expertise extends to languages like Python, JavaScript, C#, and TypeScript, as well as frameworks such as Svelte, React, and Angular. I\'ve also dived into the world of cloud technologies, including Azure and AWS, and embraced containerization with Docker.',
		},
		{
			header: 'Personal Exploration',
			content: 'My fascination with artificial intelligence and machine learning led me to delve into this cutting-edge domain. I\'ve undertaken personal projects, experimenting with AI algorithms and gaining valuable insights into the realm of intelligent systems. Additionally, my foray into frontend technologies and proficiency in Tailwind CSS showcase my commitment to delivering exceptional user experiences.',
		}
	]
</script>

{#each sections as section}
	<h1 class="text-2xl font-semibold mb-2 dark:text-gray-500">{section.header}</h1>
	<p class="text-base text-gray-700 dark:text-white">{section.content}</p>
{/each}

<style>
	p {
  padding-bottom: 10px;
}
</style>