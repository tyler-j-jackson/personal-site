<script>
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';

	let stardate = new Date();
	let message = "";
	let planetGreet = 'to Earth';
	let planetimg = '/img/earth-planet.png';
	let facts='It is a beautiful day today here';

	let planet_details = [
		{ id:1, pname: 'Mercury', greeting:'Mercurian',efact:'Messenger of the Roman gods', imgsrc:'/img/mercury.png'},
		{ id:2, pname: 'Venus', greeting:'Venusian',efact:'Roman goddess of love and beauty',imgsrc:'/img/venus.png'},
		{ id:3, pname: 'Earth', greeting:'Earthly',efact:'Earth is the only planet that was not named after a Greek or Roman god or goddess',imgsrc:'/img/earth-planet.png'},
		{ id:4, pname: 'Mars', greeting:'Martian',efact:'Roman god of war',imgsrc:'/img/mars.png'},
		{ id:5, pname: 'Jupiter',greeting:'Jovian', efact:'Ruler of the Roman gods',imgsrc:'/img/jupiter.png'},
		{ id:6, pname: 'Saturn', greeting:'Cronian',efact:'Roman god of agriculture',imgsrc:'/img/saturn.png'},
		{ id:7, pname: 'Uranus', greeting:'Caelian',efact:'Personification of heaven in ancient myth',imgsrc:'/img/uranus.png'},
		{ id:8, pname: 'Neptune', greeting:'Neptunian',efact:'Roman god of water',imgsrc:'/img/neptune.png'},
		{ id:9, pname: 'Pluto', greeting:'Plutonian',efact:'Roman god of underworld, Hades',imgsrc:'/img/pluto.png'},
	];
	$: todaysdate = `${stardate.getFullYear()}${stardate.getMonth()}${stardate.getDate()}T${stardate.getHours()}${stardate.getMinutes()}${stardate.getSeconds()}`
	$: greetingMessage = `Welcome ${planetGreet}`;

	const handleClick = () =>{
			console.log(message)
			const planet = planet_details.filter(item => item.pname.toLowerCase() == message.toLowerCase());
			if(planet.length == 0)
			{
				greetingMessage = 'Hang in there!';
				planetimg='/img/startrek.jpg';
				facts = 'You are diffcult to locate, try again or register your planet';
			}else{
				greetingMessage = `<b>${planet[0].greeting}</b>, ${todaysdate} your entry is logged`;
				planetimg= planet[0].imgsrc;
				facts = planet[0].efact;
			}
	}

</script>
<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Electrolize" rel="stylesheet">
</svelte:head>
<Header />
<main>
<div class="center">
	<div><img src="{planetimg}" alt="earth planet" width="250px" height="250px"/></div>
	<div>
		<div class="border-5"> 
			<p>Enter planet name : <input type="text" bind:value="{message}"></p>
			<p class="logentry">{@html greetingMessage}</p>
			<p><button on:click="{handleClick}">Log</button></p>

			<div>You will love to know how <b>Earthly</b> sees you: <h2>{facts}</h2></div>
		</div>
	</div>
</div>		
</main>
<Footer/>
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 960px;
		margin: 40px auto;
		font-family: 'Electrolize';
		font-style: normal;
	}
	.center {
		margin: auto;
		border: 3px solid green;
		padding: 10px;
		}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>