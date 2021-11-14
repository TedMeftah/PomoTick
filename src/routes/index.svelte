<script>
	let minutes = 0
	let seconds = 0

	function format(num) {
		return num.toString().padStart(2, '0')
	}

	$: formated = `${format(minutes)}:${format(seconds)}`
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<!-- <header>
	<button>Settings</button>
</header> -->

<div class="flex flex-col h-screen filter blur-lg select-none justify-center items-center">
	<span class="rounded-full bg-cyan-300 text-lg tracking-wider py-1 px-4 text-cyan-900 uppercase block">Working</span>
	<time class="font-bold text-10xl block" datetime="PT{minutes}M{seconds}S">{formated}</time>
</div>