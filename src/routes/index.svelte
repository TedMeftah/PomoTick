<script lang="ts">
	import { useMachine } from '@xstate/svelte'
	import Pomodoro from '@/states/pomodoro'
	import { matchesState } from 'xstate'

	function format(num) {
		return num.toString().padStart(2, '0')
	}

	let { state, send } = useMachine(Pomodoro)

	$: time = $state.context.duration - $state.context.elapsed
	$: seconds = Math.round(time % 60)
	$: minutes = Math.round((time - seconds) / 60)
	$: formated = `${format(minutes)}:${format(seconds)}`

	$: current = $state.matches('paused')
		? 'Paused'
		: $state.matches('running.work')
		? 'Work'
		: $state.matches('running.break')
		? 'Break'
		: $state.matches('running.longBreak')
		? 'Long Break'
		: ''
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
		>{current}</span
	>
	<time class="font-bold text-10xl block tabular-nums" datetime="PT{minutes}M{seconds}S"
		>{formated}</time
	>

	{$state.context.cycles}
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
