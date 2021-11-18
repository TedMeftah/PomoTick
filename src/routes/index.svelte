<script lang="ts">
	import { useMachine } from '@xstate/svelte'
	import Pomodoro from '@/states/pomodoro'
	import SettingsFrom from '@/components/SettingsFrom.svelte'

	function format(num) {
		return num.toString().padStart(2, '0')
	}

	let { state, send } = useMachine(Pomodoro)

	$: time = $state.context.duration - $state.context.elapsed
	$: seconds = Math.round(time % 60)
	$: minutes = Math.round((time - seconds) / 60)
	$: formated = `${format(minutes)}:${format(seconds)}`

	$: label = $state.matches('paused')
		? 'Paused'
		: $state.matches('running.work')
		? `Work ${$state.context.cycles}/${$state.context.settings.cycles}`
		: $state.matches('running.break:short')
		? 'Break'
		: $state.matches('running.break:long')
		? 'Long Break'
		: ''
		
	let showSettings = false
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<header class="z-100 fixed">
	<button type="button" on:click={() => (showSettings = !showSettings)}>
		<svg class="h-6 w-6" fill="none" stroke="currentColor">
			<title>Settings</title>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
			/>
		</svg>
	</button>
</header>

<SettingsFrom {send} bind:show={showSettings} context={() => $state.context.settings} />

<div class="flex flex-col h-screen select-none justify-center items-center">
	<span
		class="rounded-full bg-cyan-300 text-lg tracking-wider py-1 px-4 text-cyan-900 uppercase block"
	>
		{label}
	</span>
	
	<!-- <time class=" block " datetime="PT{minutes}M{seconds}S"></time> -->
	<svg class="my-8 mx-8 w-full max-w-[40rem]" viewBox="0 0 100 25">
		<text
			class="font-bold fill-white text-sm tabular-nums"
			transform="scale(1, 2.3)"
			textLength="100"
			lengthAdjust="spacingAndGlyphs"
			y="10.3"
		>
			{formated}
		</text>
	</svg>

	{#if $state.value === 'paused'}
		<button on:click={() => send('RESUME')}>Start</button>
	{/if}
	
	{#if $state.matches('running')}
		<button on:click={() => send('PAUSE')}>Stop</button>
	{/if}

	<button disabled={$state.value !== 'paused'} on:click={() => send('RESET')}>
		Restart
	</button>
</div>

<style>
	button:disabled {
		@apply opacity-40 pointer-events-none;
	}
</style>
