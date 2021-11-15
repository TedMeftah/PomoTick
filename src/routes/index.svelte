<script lang="ts">
	import { onMount } from 'svelte'
	import { useMachine } from '@xstate/svelte'

	import Timer from '@/states/timer'

	let minutes = 0
	let seconds = 0

	function format(num) {
		return num.toString().padStart(2, '0')
	}

	$: formated = `${format(minutes)}:${format(seconds)}`

	let timerState, timerSend

	onMount(() => {
		let { state, send } = useMachine(Timer)
		timerState = state
		timerSend = send
		return state.subscribe(({ context }) => {
			let time = context.duration - context.elapsed
			seconds = Math.round(time % 60)
			minutes = Math.round((time - seconds) / 60)
		})
	})
</script>

<svelte:head>
	<title>Timer</title>
</svelte:head>

<!-- <header>
	<button>Settings</button>
</header> -->

<div class="flex flex-col h-screen select-none justify-center items-center">
	<span
		class="rounded-full bg-cyan-300 text-lg tracking-wider py-1 px-4 text-cyan-900 uppercase block"
		>Working</span
	>
	<time class="font-bold text-10xl block tabular-nums" datetime="PT{minutes}M{seconds}S"
		>{formated}</time
	>
	{#if $timerState}
		{#if $timerState.value === 'paused'}
			<button on:click={() => timerSend('RESUME')}>Start</button>
		{/if}
		{#if $timerState.value === 'running'}
			<button on:click={() => timerSend('PAUSE')}>Stop</button>
		{/if}

		<button disabled={$timerState.value !== 'paused'} on:click={() => timerSend('RESET')}>
			Restart
		</button>
	{/if}
</div>

<style>
	button:disabled {
		@apply opacity-40 pointer-events-none;
	}
</style>
